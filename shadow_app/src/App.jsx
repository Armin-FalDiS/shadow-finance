import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Account } from './tabs/shadow/Account'
import {
    ApiOutlined,
    CodeOutlined,
    ProfileOutlined,
    SwapOutlined,
    ToolOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;

export const AccountContext = createContext({ account: null });

function App() {
    const [menuIndex, setMenuIndex] = useState("faucet");
    const [account, setAccount] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const onClick = (e) => {
        navigate(e.key);
    };

    useEffect(() => {
        setMenuIndex(location.pathname);
        if (location.pathname === "/") {
            navigate("/faucet");
        }
    }, [location, navigate]);

    const menuItems = [
        {
            label: "Faucet",
            key: "/faucet",
            icon: <ProfileOutlined />,
        },
        {
            label: "Init Liquidity Pool",
            key: "/init-pool",
            icon: <UserOutlined />,
        },
        {
            label: "Liquidity",
            key: "/liquidity",
            icon: <ApiOutlined />,
        },
        {
            label: "Swap",
            key: "/swap",
            icon: <ToolOutlined />,
        },
    ];

    return (
        <AccountContext.Provider value={{ account }}>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorPrimary: "#18e48f",
                    },
                }}
            >
                <Layout style={{ minHeight: "100vh" }}>

                    <Content style={{ padding: "50px 50px" }}>
                        <Account setAccount={setAccount} />
                    </Content>
                    <Sider breakpoint="lg" collapsedWidth="0" theme="light">
                        <div alt="Aleo SDK Logo" className="logo"></div>
                        <Menu
                            mode="inline"
                            selectedKeys={[menuIndex]}
                            items={menuItems}
                            onClick={onClick}
                        />
                    </Sider>

                    <Layout>
                        <Content style={{ padding: "50px 50px" }}>
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </AccountContext.Provider >
    );
}

export default App;
