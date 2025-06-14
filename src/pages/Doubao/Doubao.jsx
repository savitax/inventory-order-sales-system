import React from 'react'
import { Button, message } from 'antd';
import api from './api';

import { parseExcelFile, callVolcanoArkAPI, getData, UUID } from '../../utils';
import UploadFile from '../../components/UploadFile';
import TableShow from '../../components/TableShow';
import translate from '../../utils/translate';
import { fetchApi } from '../../utils/fetch';
export default function Doubao() {
    const [file, setFile] = React.useState(null);
    const [data, setData] = React.useState([]);
    const [dataShow, setDataShow] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const { apiKey, modelId } = api["DeepSeek_V3"];
    async function start() {
        if (!file) {
            return message.error('请选择文件');
        };
        setLoading(true);
        const excelData = await parseExcelFile(file);
        const prompt = `请将以下Excel表格数据转换为JSON格式,如遇到日期格式的数据请将其转化为日期类型,订单中客户所需型号的相关信息必须使用"订单详情"作为属性名,其他信息都放在"订单详情"同级,不要将其归类,确保数据结构完整且符合JSON规范：${excelData}`;
        const { jsonResult } = await callVolcanoArkAPI(apiKey, modelId, prompt);
        console.log('jsonResult:', jsonResult);

        let arr = getData(jsonResult);
        console.log('arr:', arr);
        arr.forEach((item, index) => {
            let uuid = UUID(16);
            item.id = uuid;
        })

        let showdata = JSON.parse(JSON.stringify(arr));
        showdata.forEach((item, index) => {
            item["order_date"] = `${new Date(item["order_date"]).getFullYear()}-0${new Date(item["order_date"]).getMonth() + 1}-${new Date(item["order_date"]).getDate()}`
            item["delivery_date"] = `${new Date(item["delivery_date"]).getFullYear()}-0${new Date(item["delivery_date"]).getMonth() + 1}-${new Date(item["delivery_date"]).getDate()}`
            item["key"] = index;
            return item;
        });
        setData([...data, ...arr]);
        setDataShow([...dataShow, ...showdata]);
        setLoading(false);
    }
    async function save() {
        let res = await fetchApi.post("http://localhost:8000/order", data);
        console.log(res);
        // fetchApi.post("http://localhost:8000/order", data)
        //     .then(res => res.json())
        //     .then(data => {
        //         console.log(data);
        //     })
    }

    return (
        <div>
            <UploadFile setFile={setFile} title="合同文件" />
            <Button onClick={start} loading={loading}>开始</Button>
            {dataShow.length !== 0 && <>
                <TableShow dataSource={dataShow} translate={translate} />
                <Button onClick={save}>保存</Button>
                <Button onClick={() => { setData([]); setDataShow([]) }}>清空</Button>
            </>}
        </div>
    )
}
