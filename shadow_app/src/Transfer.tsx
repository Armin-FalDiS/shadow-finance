//solely exists to test the record input functionality of leo wallet and can be removed


import React, { useState, useEffect } from 'react';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

import { Button } from "antd"
import { SketchOutlined } from '@ant-design/icons';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';
import app from "./app.json"

function tryParseJSON(input: string) {
  try {
    return JSON.parse(input);
  } catch (error) {
    return input;
  }
}

export const Transfer = () => {
  const { wallet, publicKey, requestTransaction, transactionStatus,requestRecords } = useWallet();

  let [programId] = useState(app.armin_token.id);
  let [functionName] = useState(app.armin_token.transfer_function);

  let [fee] = useState(app.armin_token.transfer_fee);
  let [transactionId, setTransactionId] = useState<string>();
  let [status, setStatus] = useState<string>();

  useEffect(() => {
    let intervalId: any;

    if (transactionId != undefined) {
      intervalId = setInterval(() => {
        transactionId && getTransactionStatus(transactionId);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [transactionId]);
  const getIndexOfHighestRecord = (records:any[])=>{
    const amounts = records.map((record) => {
        return parseInt(record.data.amount.substr(0, record.data.amount.length - 11))

    })
    return amounts.indexOf(Math.max.apply(Math,amounts))
    

  }

  const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
    if (!wallet || !publicKey || !requestTransaction) {
      throw new WalletNotConnectedError()
    }
    if(requestRecords){
    const armInRecords= await requestRecords(app.armin_token.id)
    const arminSpendable = getIndexOfHighestRecord(armInRecords)
    const arminRecord = armInRecords[arminSpendable]

    event.preventDefault();

    const inputsArray = [arminRecord,publicKey,"1000u64"]
    const parsedInputs = inputsArray.map((input) => tryParseJSON(input));
    console.log(parsedInputs)

    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.Testnet,
      programId,
      functionName,
      parsedInputs,
      fee
    );

    const txId = await requestTransaction(aleoTransaction);

    setTransactionId(txId);
}};

  const getTransactionStatus = async (txId: string) => {
    if (!transactionStatus) {
      throw new WalletNotConnectedError();
    }

    setStatus(await transactionStatus(txId));
  };

  return (
    <div>

      <div>
        <Button icon={<SketchOutlined />} type="primary" shape="round" size="large" disabled={
          !publicKey ||
          !programId ||
          !functionName ||
          fee === undefined
        }
          onClick={handleSubmit}>
          {!publicKey ? 'Connect Your Wallet' : 'Transfer'}
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