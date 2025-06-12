import { Table } from 'antd'
import React, { useEffect, useState } from 'react'

export default function TableShow(props) {
    let { dataSource, translate } = props;
    const [newDateSource, setNewDateSource] = useState([]);
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        let arr = [];
        for (let key in dataSource[0]) {
            if (key === "id") continue;
            let obj = {};
            obj["title"] = translate?.key || key;
            obj["dataIndex"] = key;
            obj["key"] = key;
            arr.push(obj);
        }
        setColumns(arr);
        setNewDateSource(dataSource.map(item => {
            item.key = item.id;
            return item;
        }))
    }, [dataSource, translate])

    return (
        <Table dataSource={newDateSource} columns={columns} />
    )
}