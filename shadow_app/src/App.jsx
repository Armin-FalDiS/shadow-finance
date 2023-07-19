import "./App.css";
import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, Layout, Menu, theme } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Account } from "./sections/state/Account";
import { Fee } from "./sections/state/Fee";
import { Tokens } from "./sections/state/Tokens";
import {
    ApiOutlined,
    CodeOutlined,
    ProfileOutlined,
    SwapOutlined,
    ToolOutlined,
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
        <AppContext.Provider
            value={{
                account,
                fee,
                setFee,
                armInToken,
                armOutToken,
                setArmInToken,
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
                    <Content style={{ padding: "50px 50px" }}>
                        <Account setAccount={setAccount} />
                        <br />
                        <Fee />
                        <br />
                        <Tokens />
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
        </AppContext.Provider>
    );
}

export default App;
