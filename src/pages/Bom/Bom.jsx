import React, { useState } from 'react';
import UploadFile from '../../components/UploadFile';
import { Button, Progress } from 'antd';
import {
    readExcelFile,
    rank,
    fillLevel,
    fillScale,
    fillNameCode,
    convertProductLineCode
} from '../../utils/bom';

export default function Bom() {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState(null);
    const [percent, setPercent] = useState(0);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    async function start() {
        setError(null);
        setPercent(0);
        setProcessing(true);

        if (!file) {
            setError("请先上传文件");
            setProcessing(false);
            return;
        }

        try {
            const list = await readExcelFile(file);

            // 模拟分阶段处理（根据实际业务拆分步骤）
            let blob = await rank(file, list);
            setPercent(20);

            blob = await fillLevel(blob, list);
            setPercent(40);

            blob = await fillScale(blob, list);
            setPercent(60);

            blob = await fillNameCode(blob, list);
            setPercent(80);

            blob = await convertProductLineCode(blob, list);
            setPercent(100, await convertProductLineCode(blob, list));
            setPercent(100);

            const url = URL.createObjectURL(blob);
            setUrl(url);
        } catch (error) {
            console.error("处理失败:", error);
            setError("文件处理失败，请检查文件格式或重试");
            setPercent(0);
        } finally {
            setProcessing(false);
        }
        console.clear();
    }

    return (
        <div>
            <UploadFile setFile={setFile} title="BOM文件" />
            <Button onClick={start} disabled={processing}>
                {processing ? "处理中..." : "开始"}
            </Button>

            {
                percent > 0 &&
                <Progress
                    percent={percent}
                    status={processing ? "active" : percent === 100 ? "success" : "normal"}
                    showInfo
                    style={{ marginTop: 16, height: 6 }}
                />
            }

            {error && <div style={{ color: "#ff4d4f", marginTop: 8 }}>{error}</div>}
            {url && <a href={url} download="BOM.xlsx">BOM.xlsx</a>}
        </div>
    );
}