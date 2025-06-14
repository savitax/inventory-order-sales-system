import React, { useEffect, useState } from 'react';
import {
    PieChartOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
const { Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}
const items = [
    getItem(<NavLink to="/order"> 订单 </NavLink>, "/order", <PieChartOutlined />), // key 改为路由路径
    getItem(<NavLink to="/doubao"> 豆包 </NavLink>, "/doubao", <PieChartOutlined />),
    getItem(<NavLink to="/bzlr"> 包装录入 </NavLink>, "/bzlr", <PieChartOutlined />),
    getItem(<NavLink to="/bom"> BOM </NavLink>, "/bom", <PieChartOutlined />),
];
const Index = () => {
    const [collapsed, setCollapsed] = useState(false);

    const [selectedKey, setSelectedKey] = useState('/order'); // 初始选中项
    const location = useLocation(); // 获取当前路由信息
    // 监听路由变化，更新选中项
    useEffect(() => {
        setSelectedKey(location.pathname); // 将当前路径设为选中的 key
    }, [location]);

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    selectedKeys={[selectedKey]} // 动态选中当前路由对应的项
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <Content style={{ margin: '0 16px' }}>
                    <Breadcrumb style={{ margin: '12px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} />
                    <div
                        style={{
                            padding: 24,
                            height: "calc(100% - 24px)",
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center', padding: "6px 0" }}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
        </Layout>
    );
};
export default Index;