import React, { useEffect } from 'react'
import OrderMenu from '../../components/OrderMenu';
import { Button, Space } from 'antd';
import TableShow from '../../components/TableShow';
import { getDateString } from '../../utils/format';
import translate from '../../utils/translate';

export default function OrderInfo() {
    const [filterList, setFilterList] = React.useState({});
    const [dataSource, setDataSource] = React.useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/order')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                let arr = [];
                data.forEach(item => {
                    item.details.forEach(detail => {
                        arr.push({
                            order_id: item.id,
                            detail_id: detail.id,
                            order_date: getDateString(detail.order_date - 0),
                            sales_man: item.sales_man,
                            delivery_date: getDateString(detail.delivery_date - 0),
                            customer_name: item.customer_name,
                            customer_order_no: item.customer_order_no,
                            sales_contract_no: item.sales_contract_no,
                            production_method: detail.production_method,
                            customer_model: detail.customer_model,
                            customer_produce_code: detail.customer_produce_code,
                            special_required: detail.special_required,
                            model: detail.model,
                            number: detail.number,
                            remarks: detail.remarks,
                            typing: detail.typing,
                            packaging: detail.packaging,
                            box_size: detail.box_size
                        })
                    })
                })
                setDataSource(arr);
            })
    }, [])
    return (
        <div>
            <Space>
                <OrderMenu setFilterList={setFilterList} />
                <div>
                    <Button onClick={() => { console.log(filterList) }}>查询</Button>
                    <Button onClick={() => { console.log(filterList) }}>重置</Button>
                </div>
            </Space>
            <TableShow dataSource={dataSource} translate={translate} />
        </div>
    )
}