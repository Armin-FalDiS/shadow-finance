import { useMemo, useState } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@demox-labs/aleo-wallet-adapter-reactui";
import { MintArmIn } from "./MintArmIn";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { MintArmOut } from "./MintArmOut";
import Swap from "./Swap";
import { Col, Radio, type RadioChangeEvent, Row } from "antd";

import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import "./App.css";
import { Liquidity } from "./liquidity";
import { FollowBar } from "./FollowBar";

enum NavTab {
    "Swap",
    "Liquidity",
}

export const App = () => {
    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: "Shadow Finance",
            }),
        ],
        []
    );
    const [tab, setTab] = useState(NavTab.Swap);

    const handleNavigationTabChange = (event: RadioChangeEvent) => {
        setTab(event.target.value);
    };

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Testnet}
            autoConnect
        >
            <FollowBar />
            <WalletModalProvider>
                <header style={{ margin: "0 3% 3%" }}>
                    <Row align="middle">
                        <Col
                            span={8}
                            style={{ display: "flex", justifyContent: "start" }}
                        >
                            <svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
                                <path clip-rule="evenodd" d="m98.96,70.37c2.16,-1.25 3.25,-1.88 3.92,-2.85c0.21,-0.3 0.38,-0.62 0.52,-0.95c0.46,-1.09 0.42,-2.34 0.33,-4.84l-0.84,-23.97c-0.1,-2.75 -0.14,-4.13 -0.8,-5.28c-0.66,-1.14 -1.82,-1.87 -4.16,-3.33l-20.3,-12.71c-2.12,-1.33 -3.18,-1.99 -4.35,-2.13c-0.36,-0.04 -0.72,-0.05 -1.08,-0.02c-1.17,0.1 -2.26,0.73 -4.42,1.98c-3.48,2.01 -5.22,3.02 -5.91,4.62c-0.21,0.48 -0.35,1 -0.41,1.52c-0.2,1.73 0.81,3.47 2.82,6.96l21.61,37.5c2.01,3.48 3.01,5.22 4.61,5.92c0.48,0.21 0.99,0.35 1.52,0.41c1.73,0.2 3.47,-0.81 6.95,-2.82l-0.01,-0.01zm9.34,-47.21c2.33,1.46 3.5,2.19 4.16,3.33c0.66,1.14 0.71,2.52 0.8,5.27l1.23,35.35c0.11,3.1 0.16,4.65 -0.55,5.93c-0.71,1.29 -2.05,2.06 -4.73,3.61l-13.26,7.67c-4.31,2.49 -6.47,3.74 -8.58,3.18c-2.11,-0.57 -3.36,-2.73 -5.85,-7.05l-31.18,-54.1c-2.49,-4.32 -3.74,-6.48 -3.17,-8.6c0.57,-2.12 2.72,-3.37 7.04,-5.86l13.26,-7.67c2.68,-1.55 4.02,-2.32 5.48,-2.3c1.47,0.03 2.78,0.85 5.4,2.49l29.94,18.75l0.01,0z" fill="#EC8924" fillRule="evenodd" />
                                <path clip-rule="evenodd" d="m59.38,93.42c-2.16,1.25 -3.25,1.88 -4.42,1.98c-0.36,0.03 -0.72,0.02 -1.08,-0.02c-1.17,-0.14 -2.23,-0.81 -4.35,-2.13l-20.3,-12.71c-2.33,-1.46 -3.5,-2.19 -4.16,-3.33c-0.66,-1.14 -0.71,-2.52 -0.8,-5.28l-0.84,-23.97c-0.09,-2.51 -0.13,-3.76 0.33,-4.84c0.14,-0.33 0.32,-0.65 0.52,-0.95c0.67,-0.97 1.76,-1.59 3.92,-2.85c3.48,-2.01 5.22,-3.02 6.95,-2.82c0.52,0.06 1.03,0.2 1.52,0.41c1.6,0.7 2.6,2.44 4.61,5.92l21.61,37.5c2.01,3.48 3.01,5.22 2.82,6.96c-0.06,0.52 -0.2,1.04 -0.41,1.52c-0.69,1.6 -2.43,2.6 -5.91,4.62l-0.01,-0.01zm-45.48,-15.5c0.1,2.75 0.15,4.13 0.8,5.28c0.66,1.14 1.82,1.87 4.16,3.33l29.94,18.75c2.62,1.64 3.94,2.46 5.4,2.49c1.47,0.02 2.81,-0.75 5.48,-2.3l13.26,-7.67c4.31,-2.49 6.47,-3.74 7.04,-5.86c0.57,-2.12 -0.68,-4.28 -3.17,-8.6l-31.18,-54.1c-2.49,-4.32 -3.74,-6.48 -5.85,-7.05c-2.11,-0.57 -4.27,0.68 -8.58,3.18l-13.26,7.67c-2.68,1.55 -4.02,2.33 -4.73,3.61c-0.71,1.28 -0.66,2.83 -0.55,5.93l1.23,35.35l0.01,-0.01z" fill="#EC8924" fillRule="evenodd" />
                            </svg>
                        </Col>

                        <Col
                            span={8}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <nav>
                                <Radio.Group
                                    optionType="button"
                                    size="large"
                                    onChange={handleNavigationTabChange}
                                    value={tab}
                                >
                                    <Radio.Button value={NavTab.Swap}>
                                        Swap
                                    </Radio.Button>
                                    <Radio.Button value={NavTab.Liquidity}>
                                        Liquidity
                                    </Radio.Button>
                                </Radio.Group>
                            </nav>
                        </Col>

                        <Col
                            span={8}
                            style={{ display: "flex", justifyContent: "end" }}
                        >
                            <WalletMultiButton />
                        </Col>
                    </Row>
                </header>

                <aside>
                    <Row>
                        <Col>
                            <MintArmIn />
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col>
                            <MintArmOut />
                        </Col>
                    </Row>
                </aside>

                <main>
                    {tab == NavTab.Swap && <Swap />}
                    {tab == NavTab.Liquidity && <Liquidity />}
                </main>
            </WalletModalProvider>
        </WalletProvider>
    );
};
