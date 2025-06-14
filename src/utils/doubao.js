const XLSX = require('xlsx');
// 解析Excel文件
function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // 获取第一个工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // 转换为JSON
                // const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // 保存Excel数据用于预览
                // excelData = jsonData;

                // 转换为CSV格式作为提示词
                const csvData = XLSX.utils.sheet_to_csv(worksheet);

                resolve(csvData);
            } catch (error) {
                reject(new Error('Excel解析失败: ' + error.message));
            }
        };

        reader.onerror = function () {
            reject(new Error('文件读取失败'));
        };

        reader.readAsArrayBuffer(file);
    });
}

// 从API响应中提取JSON
function extractJsonFromResponse(apiResponse) {
    try {
        // 假设响应在content字段中
        const content = apiResponse.choices[0]?.message?.content || '';

        // 尝试直接解析JSON
        try {
            return JSON.parse(content);
        } catch (e) {
            // 尝试提取JSON块
            const jsonRegex = /```json([\s\S]*?)```|```([\s\S]*?)```|({[\s\S]*})/;
            const match = content.match(jsonRegex);

            if (match) {
                // 提取可能的JSON部分
                const jsonPart = match[1] || match[2] || match[3];
                if (jsonPart) {
                    return JSON.parse(jsonPart.trim());
                }
            }

            throw new Error('无法从响应中提取有效的JSON');
        }
    } catch (error) {
        console.error('JSON解析错误:', error);
        throw new Error('JSON解析失败: ' + error.message);
    }
}

async function callVolcanoArkAPI(apiKey, modelId, prompt) {
    try {
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.1,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API请求失败 (${response.status}): ${errorData.error?.message || '未知错误'}`);
        }

        const apiResponse = await response.json();
        // const jsonResult = apiResponse;
        const jsonResult = extractJsonFromResponse(apiResponse);

        return { jsonResult, apiResponse };
    } catch (error) {
        console.error('API调用错误:', error);
        throw new Error('火山方舟API调用失败: ' + error.message);
    }
}

function getData(data) {
    let arr = [];
    data["订单详情"].forEach((item, index) => {
        let obj = {};
        obj["order_date"] = new Date(data["下单日期"]).getTime();
        obj["sales_man"] = data["业务员"];
        obj["delivery_date"] = new Date(data["交货日期"]).getTime();
        obj["customer_name"] = data["客户名称"];
        obj["customer_order_no"] = data["客户订单号"];
        obj["sales_contract_no"] = data["销售合同号"];
        obj["production_method"] = item["自制/外购"] || item["自制外购"];
        obj["customer_model"] = item["客户货号"];
        obj["customer_produce_code"] = item["客户物料码"];
        obj["special_required"] = item["特殊要求"];
        obj["model"] = item["品名编码"];
        obj["number"] = item["数量"];
        item["remarks"] && (obj["备注"] = item["备注"]);
        obj["typing"] = item["打字内容"];
        obj["packaging"] = item["包装方式"];
        obj["box_size"] = item["包装盒尺寸"];
        arr.push(obj);
    })
    return arr;
}
export {
    parseExcelFile,
    callVolcanoArkAPI,
    extractJsonFromResponse,
    getData
};