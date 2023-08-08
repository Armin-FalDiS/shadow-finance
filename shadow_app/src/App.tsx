import { useMemo } from "react";
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

export const App = () => {
  const wallets = useMemo(
    () => [
      new LeoWalletAdapter({
        appName: "Leo Demo App",
      }),
    ],
    []
  );

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.Testnet}
      autoConnect
    >
      <WalletModalProvider>

        <WalletMultiButton/>
         <Init/>




      </WalletModalProvider>
    </WalletProvider>
  );
};