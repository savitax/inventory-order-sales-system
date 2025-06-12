/* eslint-disable */
import { DatePicker, Descriptions, Input, Select } from 'antd';
import React from 'react'

export default function OrderMenu(props) {
    const [salesman, setSalesman] = React.useState();                   // 业务员
    const [salesmanlist, setSalesmanlist] = React.useState();           // 业务员列表
    const [customer, setCustomer] = React.useState();                   // 客户
    const [customerList, setCustomerList] = React.useState();           // 客户列表

    const [order_date, setOrder_date] = React.useState();               // 下单日期范围
    const [delivery_date, setDelivery_date] = React.useState();         // 发货日期范围
    const [sales_contract_no, setSales_contract_no] = React.useState(); // 销售合同号
    const [customer_order_no, setCustomer_order_no] = React.useState(); // 客户订单号
    const [model, setModel] = React.useState();                         // 品名编码
    const [special_required, setSpecial_required] = React.useState();   // 特殊要求
    const [order_status, setOrder_status] = React.useState();           // 订单状态
    const [is_self_buy, setIs_self_buy] = React.useState();             // 自制外购

    React.useEffect(() => {
        fetch('http://localhost:8000/customer')
            .then(res => res.json())
            .then(data => {
                let arr = [];
                data.forEach(item => {
                    arr.push({ value: item.id, label: item.name })
                })
                setCustomerList(arr);
            })
        fetch('http://localhost:8000/sales_man')
            .then(res => res.json())
            .then(data => {
                let arr = [];
                data.forEach(item => {
                    arr.push({ value: item.id, label: item.name })
                })
                setSalesmanlist(arr);
            })
    }, [])

    React.useEffect(() => {
        const { setFilterList } = props;
        let obj = { order_date, delivery_date, salesman, customer, sales_contract_no, customer_order_no, model, special_required, order_status, is_self_buy };
        for (let key in obj) {
            !!obj[key] === false && delete obj[key];
        }
        setFilterList(obj);
    },[order_date, delivery_date, salesman, customer, sales_contract_no, customer_order_no, model, special_required, order_status, is_self_buy])

    const menulist = [
        {
            label: '下单日期范围',
            children: <DatePicker.RangePicker onChange={(date, dateString) => { setOrder_date(dateString); console.log(date, dateString); }} />
        },
        {
            label: '销售合同号',
            children: <Input style={{ width: 180 }} value={sales_contract_no} onChange={(e) => { setSales_contract_no(e.target.value); }} />
        },
        {
            label: '品名编码',
            children: <Input style={{ width: 180 }} value={model} onChange={(e) => { setModel(e.target.value); }} />
        },
        {
            label: '业务员',
            children: <Select
                style={{ width: 120 }}
                onChange={value => setSalesman(value)}
                options={salesmanlist}
            />
        },
        {
            label: '订单状态',
            children: <Select
                style={{ width: 120 }}
                onChange={(value) => { setOrder_status(value); }}
                defaultValue={'0'}
                options={[{ value: '0', label: "全部" }, { value: '1', label: '运行中' }, { value: '2', label: '已完成' }, { value: '3', label: "已取消" }, { value: '4', label: "已关闭" }, { value: '5', label: "已超时" }]}
            />
        },
        {
            label: '订单交期范围',
            children: <DatePicker.RangePicker onChange={(date, dateString) => { setDelivery_date(dateString); console.log(date, dateString); }} />
        },
        {
            label: '客户订单号',
            children: <Input style={{ width: 180 }} value={customer_order_no} onChange={(e) => { setCustomer_order_no(e.target.value); }} />
        },
        {
            label: '特殊要求',
            children: <Input style={{ width: 180 }} value={special_required} onChange={(e) => { setSpecial_required(e.target.value); }} />
        },
        {
            label: '客户名',
            children: <Select
                style={{ width: 120 }}
                onChange={value => { setCustomer(value); }}
                options={customerList}
            />
        },
        {
            label: '自制外购',
            children: <Select
                style={{ width: 120 }}
                onChange={(value) => { setIs_self_buy(value); console.log(value); }}
                defaultValue={'0'}
                options={[{ value: '0', label: "默认" }, { value: '1', label: '自制' }, { value: '2', label: '外购' }]}
            />
        }
    ]
    const items = menulist.map((item, index) => {
        return {
            key: index,
            label: item.label,
            children: item.children
        }
    })
    return (
        <Descriptions title="订单" items={items} column={5} />
    )
}
