import React, { useState } from 'react';
const ExcelJS = require('exceljs');
import { Button, Progress, Space, Alert } from 'antd';
import UploadFile from '../Components/UploadFile';

// 简单评估公式值（仅处理加减法）
function evaluateFormula(formula) {
    try {
        // 简单处理加减法
        return Function(`'use strict';return (${formula})`)();
    } catch (e) {
        console.warn("公式评估失败:", formula, e);
        return 0;
    }
}

async function processExcelFiles(ddFile, bzFile, setPercent, setProcessing) {
    setProcessing(true);
    setPercent(0);

    const DD = new ExcelJS.Workbook();
    const BZ = new ExcelJS.Workbook();

    try {
        // 读取文件阶段
        setPercent(10);

        const ddArrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(ddFile);
        });

        const bzArrayBuffer = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(bzFile);
        });

        await DD.xlsx.load(ddArrayBuffer);
        await BZ.xlsx.load(bzArrayBuffer);
        console.log("读取成功");

        // 读取完成，更新进度
        setPercent(20);
    } catch (error) {
        console.error("读取失败", error);
        setProcessing(false);
        return;
    }

    const DD_Sheet = DD.getWorksheet("Sheet1");
    const BZ_Sheet = BZ.getWorksheet("Sheet1");

    // 获取表头信息
    const bzTitleRes = [...BZ_Sheet.getRow(1).values].slice(1);
    const ddTitleRes = [...DD_Sheet.getRow(1).values].slice(1);

    // 提取包装表数据并过滤空行
    const bzData = [];
    BZ_Sheet.eachRow({ includeEmpty: true, rowNumbers: true }, (row, rowNumber) => {
        if (rowNumber <= 1) return;

        const obj = {};
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            obj[bzTitleRes[colNumber - 1]] = cell.value;
        });

        // 过滤无效行
        if (obj["销售合同号"] && obj["产品型号"] && obj["包装产品数量"] > 0) {
            obj.rowNumber = rowNumber;
            obj.originalQuantity = obj["包装产品数量"];
            obj.remainingQuantity = obj["包装产品数量"];
            bzData.push(obj);
        }
    });

    // 获取订单表关键列索引
    const ddHthIndex = ddTitleRes.indexOf("销售合同号") + 1;
    const ddPmIndex = ddTitleRes.indexOf("品名编码") + 1;
    const ddNumberIndex = ddTitleRes.indexOf("数量") + 1;
    const ddTimeIndex = ddTitleRes.indexOf("包装日期") + 1;
    const ddYetIndex = ddTitleRes.indexOf("已包数") + 1;

    // 处理订单表
    let processedCount = 0;
    const totalRows = DD_Sheet.rowCount - 1; // 减去表头行

    for (let rowNumber = 2; rowNumber <= DD_Sheet.rowCount; rowNumber++) {
        const row = DD_Sheet.getRow(rowNumber);

        // 获取订单信息
        const hth = row.getCell(ddHthIndex).value;        // 销售合同号
        const pm = row.getCell(ddPmIndex).value;          // 产品型号
        const number = row.getCell(ddNumberIndex).value;  // 需要包装数量
        let yetCell = row.getCell(ddYetIndex);
        let yet = yetCell.value;                          // 当前已经包装数量

        // 解析已包数的值和公式
        let originalFormula = "";
        let originalValue = 0;

        if (yet && typeof yet === 'object' && yet.formula) {
            originalFormula = yet.formula.replace(/^=/, ''); // 移除开头的等号
            originalValue = evaluateFormula(originalFormula);
        } else if (typeof yet === 'number') {
            originalFormula = yet.toString();
            originalValue = yet;
        }

        let remainingToPack = Math.max(0, number - originalValue);
        let latestPackDate = null;
        let newPackedQuantities = [];

        // 如果有需要包装的数量
        if (remainingToPack > 0) {
            // 查找匹配的包装记录
            for (const bzItem of bzData) {
                if (bzItem.remainingQuantity <= 0) continue;

                if (hth == bzItem["销售合同号"] && pm == bzItem["产品型号"]) {
                    // 可使用的包装数量，不超过剩余需要和可用量
                    const availableQuantity = Math.min(bzItem.remainingQuantity, remainingToPack);

                    if (availableQuantity > 0) {
                        // 更新包装记录剩余数量
                        bzItem.remainingQuantity -= availableQuantity;

                        // 记录新增的包装数量
                        newPackedQuantities.push(availableQuantity);
                        remainingToPack -= availableQuantity;

                        // 记录最新包装日期
                        if (bzItem["包装日期"]) {
                            latestPackDate = bzItem["包装日期"];
                        }

                        // 如果已满足订单需求，跳出循环
                        if (remainingToPack <= 0) break;
                    }
                }
            }

            // 更新订单表中的已包数
            if (newPackedQuantities.length > 0) {
                // 构建新的公式部分
                const newFormulaPart = newPackedQuantities.join('+');

                // 组合完整公式
                let fullFormula = "";
                if (originalFormula) {
                    fullFormula = `=${originalFormula}+${newFormulaPart}`;
                } else {
                    fullFormula = `=${newFormulaPart}`;
                }

                // 应用公式，并确保不超过订单数量
                const finalFormula = `=${fullFormula.substring(1)}`;

                // 正确设置公式
                yetCell.value = { formula: finalFormula };

                // 更新包装日期
                if (latestPackDate) {
                    row.getCell(ddTimeIndex).value = latestPackDate;
                }

                // 强制Excel重新计算公式
                yetCell.calculatedValue = Math.min(
                    evaluateFormula(fullFormula.substring(1)),
                    number
                );
            }
        }

        // 更新进度
        processedCount++;
        const currentPercent = 20 + Math.floor(processedCount / totalRows * 70); // 20% 是之前的进度
        setPercent(currentPercent);

        // 添加微小延迟，让UI有时间更新
        if (processedCount % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    // 更新包装表状态
    const statusColumnIndex = bzTitleRes.length + 1;
    const remainingColumnIndex = bzTitleRes.length + 2;

    BZ_Sheet.getRow(1).getCell(statusColumnIndex).value = "问题";
    BZ_Sheet.getRow(1).getCell(remainingColumnIndex).value = "剩余数量";

    for (const bzItem of bzData) {
        const row = BZ_Sheet.getRow(bzItem.rowNumber);

        if (bzItem.remainingQuantity === 0) {
            row.getCell(statusColumnIndex).value = "已完成";
        } else if (bzItem.remainingQuantity < bzItem.originalQuantity) {
            row.getCell(statusColumnIndex).value = "部分使用";
        } else {
            row.getCell(statusColumnIndex).value = "未使用";
        }

        row.getCell(remainingColumnIndex).value = bzItem.remainingQuantity;
    }

    // 保存结果
    setPercent(90);

    const ddBuffer = await DD.xlsx.writeBuffer();
    const bzBuffer = await BZ.xlsx.writeBuffer();

    const ddBlob = new Blob([ddBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const bzBlob = new Blob([bzBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    setPercent(100);
    setProcessing(false);

    return {
        dd: ddBlob,
        bz: bzBlob
    };
}

export default function Bzlr() {
    const [bz, setBz] = useState(null);
    const [dd, setDd] = useState(null);
    const [result, setResult] = useState(null);
    const [ddUrl, setDdUrl] = useState('');
    const [bzUrl, setBzUrl] = useState('');
    const [percent, setPercent] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    const handleProcessFiles = async () => {
        setError(null);

        if (dd && bz) {
            try {
                const processedResult = await processExcelFiles(dd, bz, setPercent, setProcessing);
                setResult(processedResult);
                if (processedResult) {
                    const ddUrl = URL.createObjectURL(processedResult.dd);
                    const bzUrl = URL.createObjectURL(processedResult.bz);
                    setDdUrl(ddUrl);
                    setBzUrl(bzUrl);
                }
            } catch (error) {
                console.error("处理文件时出错:", error);
                setError("处理文件时出错，请重试");
            }
        }
        else {
            setError("请选择包装文件和订单文件");
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
            <h3>Excel文件处理工具</h3>

            <UploadFile setFile={setBz} title="包装文件" />
            <div style={{ height: 20, width: '100%' }}></div>
            <UploadFile setFile={setDd} title="订单文件" />

            <Space direction="vertical" style={{ display: 'block', marginTop: 20 }}>
                <Button
                    type="primary"
                    onClick={handleProcessFiles}
                    disabled={processing}
                >
                    {processing ? '处理中...' : '开始处理'}
                </Button>

                {error && (
                    <Alert message={error} type="error" showIcon />
                )}

                <Progress
                    percent={percent}
                    status={processing ? 'active' : percent === 100 ? 'success' : 'normal'}
                    showInfo
                />

                {result && (
                    <div style={{ marginTop: 20 }}>
                        <h4>处理结果:</h4>
                        <a href={ddUrl} download="订单_.xlsx"> 订单_.xlsx </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href={bzUrl} download="包装_.xlsx"> 包装_.xlsx </a>
                    </div>
                )}
            </Space>
        </div>
    )
}