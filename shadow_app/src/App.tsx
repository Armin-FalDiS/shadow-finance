import { useMemo, useState } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { MintArmIn } from "./MintArmIn";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { MintArmOut } from "./MintArmOut";
import Swap from "./Swap";
import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import { Init } from "./Init";
import { Liquidity } from "./liquidity/Liquidity";
import { Col, Radio, RadioChangeEvent, Row } from "antd";

enum NavTab {
  'Swap',
  'Liquidity'
};


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
    alert(tab);
  };

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.Testnet}
      autoConnect
    >
      <WalletModalProvider>
        <header>
          <Row align='middle'>
            <Col span={8} style={{ display: 'flex', justifyContent: 'start' }}>
              <div style={{ color: 'red' }}>ShadowFi</div>
            </Col>

            <Col span={8} style={{ display: 'flex', justifyContent: 'center' }}>
              <nav>
                <Radio.Group size="large" onChange={handleNavigationTabChange} value={tab}>
                  <Radio.Button value={NavTab.Swap}>Swap</Radio.Button>
                  <Radio.Button value={NavTab.Liquidity}>Liquidity</Radio.Button>
                </Radio.Group>
              </nav>
            </Col>

            <Col span={8} style={{ display: 'flex', justifyContent: 'end' }}>
              <WalletMultiButton />
            </Col>
          </Row>
        </header>
      </WalletModalProvider>
    </WalletProvider>
  );
};