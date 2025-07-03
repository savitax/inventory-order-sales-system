import React, { useEffect } from 'react'
import OrderMenu from '../../components/OrderMenu';
import { Button, Space } from 'antd';
import TableShow from '../../components/TableShow';
import { getDateString } from '../../utils/format';
import translate from '../../utils/translate';
import { useSelector } from 'react-redux';

export default function OrderInfo() {
    const filterObj = useSelector(state => state.filterObj);    // 获取过滤条件
    const [dataSource, setDataSource] = React.useState([]);     // 初始数据
    const [filterDataSource, setFilterDataSource] = React.useState([]);     // 过滤后的数据
    // 获取初始数据
    useEffect(() => {
        fetch('http://localhost:8000/order')
            .then(res => res.json())
            .then(data => {
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
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    function search() {
        let newArr = JSON.parse(JSON.stringify(dataSource));        // 初始化过滤数据
        let newFilterObj = JSON.parse(JSON.stringify(filterObj));   // 初始化过滤条件
        // 删除无用过滤条件
        for (let key in newFilterObj) {
            !!newFilterObj[key] === false && delete newFilterObj[key];
        }
        console.log(newFilterObj);

        // 如果没有过滤条件，则返回初始数据
        if (!!newFilterObj === false) {
            setFilterDataSource(dataSource);
            return
        }
        for (let key in newFilterObj) {
            console.log(key, newFilterObj[key]);
            newArr = newArr.filter(item => item[key] === newFilterObj[key]);
        }
        setFilterDataSource(newArr);
    }
    function reset() {
        console.log('reset');
    }
    return (
        <div>
            <Space>
                <OrderMenu />
                <div>
                    <Button onClick={() => { search() }}>查询</Button>
                    <Button onClick={() => { reset() }}>重置</Button>
                </div>
            </Space>
            <TableShow dataSource={filterDataSource} translate={translate} />
        </div>
    )
}