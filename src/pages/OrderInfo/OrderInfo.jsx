import React from 'react'
import OrderMenu from '../../components/OrderMenu';
import { Button, Space } from 'antd';
import TableShow from '../../components/TableShow';

export default function OrderInfo() {
    const [filterList, setFilterList] = React.useState({});

    return (
        <div>
            <Space>
                <OrderMenu setFilterList={setFilterList} />
                <div>
                    <Button onClick={() => { console.log(filterList) }}>查询</Button>
                    <Button onClick={() => { console.log(filterList) }}>重置</Button>
                </div>
            </Space>
            <TableShow dataSource={[{ name: "八嘎", age: "80", id: "111" }]} />
        </div>
    )
}
