import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
    BankOutlined,
    SwapOutlined,
    BgColorsOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;

export const AppContext = createContext();

function App() {
    const [menuIndex, setMenuIndex] = useState("faucet");
    const [account, setAccount] = useState(null);
    const [fee, setFee] = useState(null);
    const [armInToken, setArmInToken] = useState(null);
    const [armOutToken, setArmOutToken] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();
    const onClick = (e) => {
        navigate(e.key);
    };

    useEffect(() => {
        setMenuIndex(location.pathname);
        if (location.pathname === "/") {
            navigate("/account");
        }
    }, [location, navigate]);

    const menuItems = [
        {
            label: "My Account",
            key: "/account",
            icon: <UserOutlined />,
        },
        {
            label: "Faucet",
            key: "/faucet",
            icon: <BankOutlined />,
        },
        {
            label: "Liquidity",
            key: "/liquidity",
            icon: <BgColorsOutlined />,
        },
        {
            label: "Swap",
            key: "/swap",
            icon: <SwapOutlined />,
        },
    ];

    return (
        <AppContext.Provider
            value={{
                account,
                setAccount,
                fee,
                setFee,
                armInToken,
                setArmInToken,
                armOutToken,
                setArmOutToken,
            }}
        >
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorPrimary: "#18e48f",
                    },
                }}
            >
                <Layout style={{ minHeight: "100vh" }}>
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
        </AppContext.Provider>
    );
}

export default App;
