/* eslint-disable */
import { DatePicker, Descriptions, Input, Select } from 'antd';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { update } from '../redux/filterObjSlice';

export default function OrderMenu(props) {
    const dispatch = useDispatch();
    const [salesmanList, setSalesmanList] = React.useState();           // 业务员列表
    const [customerList, setCustomerList] = React.useState();           // 客户列表

    const [filterState, setFilterState] = React.useState({
        sales_man: null,               // 业务员
        customer_name: null,            // 客户
        order_date: null,               // 下单日期范围
        delivery_date: null,            // 发货日期范围
        sales_contract_no: null,        // 销售合同号
        customer_order_no: null,        // 客户订单号
        model: null,                    // 品名编码
        special_required: null,         // 特殊要求
        order_status: null,             // 订单状态
        is_self_buy: null,              // 自制外购
    });

    useEffect(() => {
        dispatch(update(filterState));
    }, [filterState])

    // 获取业务员和客户列表
    React.useEffect(() => {
        fetch('http://localhost:8000/customer')
            .then(res => res.json())
            .then(data => {
                let arr = [];
                data.forEach(item => {
                    arr.push({ value: item.id, label: item.name })
                })
                setCustomerList(arr);
            }).catch(err => { console.log(err); })
        fetch('http://localhost:8000/sales_man')
            .then(res => res.json())
            .then(data => {
                let arr = [];
                data.forEach(item => {
                    arr.push({ value: item.id, label: item.name })
                })
                setSalesmanList(arr);
            }).catch(err => { console.log(err); })
    }, [])

    const menulist = [
        {
            label: '下单日期范围',
            children: <DatePicker.RangePicker onChange={(date, dateString) => { setFilterState({ ...filterState, order_date: dateString }); }} />
        },
        {
            label: '销售合同号',
            children: <Input style={{ width: 180 }} value={filterState.sales_contract_no} onChange={(e) => { setFilterState({ ...filterState, sales_contract_no: e.target.value }); }} />
        },
        {
            label: '品名编码',
            children: <Input style={{ width: 180 }} value={filterState.model} onChange={(e) => { setFilterState({ ...filterState, model: e.target.value }); }} />
        },
        {
            label: '业务员',
            children: <Select
                style={{ width: 120 }}
                onChange={value => {
                    salesmanList.forEach(item => {
                        if (item.value === value) {
                            setFilterState({ ...filterState, sales_man: item.label });
                            return;
                        }
                    });
                }}
                options={salesmanList}
                value={filterState.sales_man}
            />
        },
        {
            label: '订单状态',
            children: <Select
                style={{ width: 120 }}
                onChange={(value) => { setFilterState({ ...filterState, order_status: value }); }}
                defaultValue={'全部'}
                options={[{ value: '全部', label: "全部" }, { value: '运行中', label: '运行中' }, { value: '已完成', label: '已完成' }, { value: '已取消', label: "已取消" }, { value: '已关闭', label: "已关闭" }, { value: '已超时', label: "已超时" }]}
            />
        },
        {
            label: '订单交期范围',
            children: <DatePicker.RangePicker onChange={(date, dateString) => { setFilterState({ ...filterState, delivery_date: dateString }); }} />
        },
        {
            label: '客户订单号',
            children: <Input style={{ width: 180 }} value={filterState.customer_order_no} onChange={(e) => { setCustomer_order_no(e.target.value); }} />
        },
        {
            label: '特殊要求',
            children: <Input style={{ width: 180 }} value={filterState.special_required} onChange={(e) => { setSpecial_required(e.target.value); }} />
        },
        {
            label: '客户名',
            children: <Select
                style={{ width: 120 }}
                onChange={value => {
                    customerList.forEach(item => {
                        if (item.value === value) {
                            setFilterState({ ...filterState, customer_name: item.label });
                            return;
                        }
                    });
                }}
                options={customerList}
                value={filterState.customer_name}
            />
        },
        {
            label: '自制外购',
            children: <Select
                style={{ width: 120 }}
                onChange={(value) => {
                    setFilterState({ ...filterState, is_self_buy: value });
                }}
                options={[{ value: '自制', label: '自制' }, { value: '外购', label: '外购' }]}
                value={filterState.is_self_buy}
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
