import { useState, useEffect, ChangeEvent, FC } from 'react';


import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Button, Form} from "antd"
import {SketchOutlined }from '@ant-design/icons';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';

function tryParseJSON(input) {
  try {
    return JSON.parse(input);
  } catch (error) {
    return input;
  }
}

const MintArmOut  = () => {
  const { wallet, publicKey } = useWallet();
  const [size, setSize] = useState('large');

  let [programId, setProgramId] = useState('armin_token.aleo');
  let [functionName, setFunctionName] = useState('mint_armin');
  let [inputs, setInputs] = useState("change this");  //this needs to change
  let [fee, setFee] = useState(100000);
  let [transactionId, setTransactionId] = useState();
  let [status, setStatus] = useState();

  useEffect(() => {
    let intervalId;

    if (transactionId) {
      intervalId = setInterval(() => {
        getTransactionStatus(transactionId);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!publicKey) throw new WalletNotConnectedError();

    const inputsArray = inputs.split('\n');
    const parsedInputs = inputsArray.map((input) => tryParseJSON(input));

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      programId,
      functionName,
      parsedInputs,
      fee
    );

    const txId =
      (await (wallet?.adapter).requestTransaction(
        aleoTransaction
      )) || '';
    setTransactionId(txId);
  };

  const getTransactionStatus = async (txId) => {
    const status = await (
      wallet?.adapter
    ).transactionStatus(txId);
    setStatus(status);
  };

  return (
    <div>

      <div>
         <Button icon={<SketchOutlined />} type="primary Submit" shape="round" size={size} disabled={
                !publicKey ||
                !programId ||
                !functionName ||
                !inputs ||
                fee === undefined
              }
              onClick={handleSubmit}>
            {!publicKey ? 'Connect Your Wallet' : 'Mint ArmOut'}
        </Button>



          

        {transactionId && (
          <div>
            <div>{`Transaction status: ${status}`}</div>
          </div>
        )}
      </div>
    </div>
  );
};


export default MintArmOut;






