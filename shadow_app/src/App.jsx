import React, { FC, useMemo } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import MintArmin from "./MintArmIn";
import MintArmOut from "./MintArmOut";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
  DecryptPermission,
  WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";


// Default styles that can be overridden by your app
require("@demox-labs/aleo-wallet-adapter-reactui/styles.css");

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
      network={WalletAdapterNetwork.Localnet}
      autoConnect
    >
      <WalletModalProvider>
        <WalletMultiButton></WalletMultiButton>
        <MintArmin />
        <MintArmOut/>


      </WalletModalProvider>
    </WalletProvider>
  );
};