import React, { useEffect } from 'react'
import OrderMenu from '../../components/OrderMenu';
import { Button, Space } from 'antd';
import TableShow from '../../components/TableShow';
import { getDateString } from '../../utils/format';
import translate from '../../utils/translate';

export default function OrderInfo() {
    const [filterList, setFilterList] = React.useState({});
    const [dataSource, setDataSource] = React.useState([]);
    const [filterDataSource, setFilterDataSource] = React.useState([]);
    useEffect(() => {
        fetch('http://localhost:8000/order')
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                let arr = [];
                data.forEach(item => {
                    arr.push({
                        id: item.id,
                        key: item.id,
                        order_date: getDateString(item.order_date - 0),
                        sales_man: item.sales_man,
                        delivery_date: getDateString(item.delivery_date - 0),
                        customer_name: item.customer_name,
                        customer_order_no: item.customer_order_no,
                        sales_contract_no: item.sales_contract_no,
                        production_method: item.production_method,
                        customer_model: item.customer_model,
                        customer_produce_code: item.customer_produce_code,
                        special_required: item.special_required,
                        model: item.model,
                        number: item.number,
                        remarks: item.remarks,
                        typing: item.typing,
                        packaging: item.packaging,
                        box_size: item.box_size
                    })
                })
                setDataSource(arr);
                setFilterDataSource(arr);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    function search() {
        console.log(filterDataSource);
        let newArr = JSON.parse(JSON.stringify(filterDataSource));
        if (!!filterList === false) {
            setFilterDataSource(dataSource);
            return
        }
        for (let key in filterList) {
            console.log(key, filterList[key]);
            newArr = newArr.filter(item => item[key] === filterList[key]);
        }
        setFilterDataSource(newArr);
    }
    function reset() {
        setFilterList({});
        setFilterDataSource(dataSource);
        const event = new Event('clear-child-data');
        window.dispatchEvent(event);
    }
    return (
        <div>
            <Space>
                <OrderMenu setFilterList={setFilterList} />
                <div>
                    <Button onClick={() => { search() }}>查询</Button>
                    <Button onClick={() => { reset() }}>重置</Button>
                </div>
            </Space>
            <TableShow dataSource={filterDataSource} translate={translate} />
        </div>
    )
}