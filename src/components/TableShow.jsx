import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

export default function TableShow(props) {
    let { dataSource, translate } = props;
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let arr = [];
        for (let key in dataSource[0]) {
            if (key === "id") continue;
            if (key === "order_id") continue;
            if (key === "detail_id") continue;
            if (key === "key") continue;
            let obj = {};
            obj["title"] = translate && translate[key] ? translate[key] : key;
            obj["dataIndex"] = key;
            arr.push(obj);
        }
        setColumns(arr);
    }, [dataSource, translate])
    return (
        <Table dataSource={dataSource} columns={columns} />
    )
}