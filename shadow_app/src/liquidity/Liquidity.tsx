import React, { useEffect, useState } from 'react';
import { Button, Cascader, InputNumber } from 'antd';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { getArmInReserve, getArmOutReserve, parseU64Response } from "../general"
import app from "../app.json"
import { UserState } from './UserState';
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction
} from "@demox-labs/aleo-wallet-adapter-base";
import { EmptyLP } from './EmptyLP';
import { Burn } from './Burn';
interface Option {
    value: string;
    label: string;
}
export const enum LiquidiyTab{
    Empty = 1,
    Supply,
    UserState,
    Burn,
  }

export const Liquidity = () => {

    const { wallet, publicKey, requestRecords, requestTransaction } = useWallet();

    const options: Option[] = [
        {
            value: 'ArmIn Token',
            label: 'ArmIn Token',
        },
        {
            value: 'ArmOut Token',
            label: 'ArmOut Token',
        },
    ];


    const [programId] = useState(app.shadow_swap.id);
    const [functionName, setFunctionName] = useState(app.shadow_swap.provide_function);
    const [inputs, setInputs] = useState("change this");  //this needs to change
    const [fee, setFee] = useState(app.shadow_swap.provide_fee);
    const [upperToken, setUpperToken] = useState<any>()
    const [lowerToken, setLowerToken] = useState<any>()
    const [upperTokenAmount, setUpperTokenAmount] = useState(0)
    const [lowerTokenAmount, setLowerTokenAmount] = useState(0)
    const [upperBalance, setUpperBalance] = useState(0)
    const [lowerSpendable, setLowerSpendable] = useState(0)
    const [upperSpendable, setUpperSpendable] = useState(0)
    const [lowerBalanace, setLowerBalance] = useState(0)
    const [liquidityTabState, setLiquidityTabState] = useState(LiquidiyTab.UserState)
    const [transactionId, setTransactionId] = useState<string>();

   



    const updateUpperBalance = async () => {
        let program = ""

        upperToken == "ArmIn Token" ? program = app.armin_token.id : program = app.armout_token.id

        if (!publicKey) throw new WalletNotConnectedError();
        if (requestRecords) {
            const records = await requestRecords(program);
            const amounts = records.map((record) => {
                return parseInt(record.data.amount.substr(0, record.data.amount.length - 11))

            })
            let sum = 0
            amounts.forEach((num) => {
                sum += num
            })
            setUpperBalance(sum)
            setUpperSpendable(Math.max(...amounts))
        }


    }
    const updateLowerBalance = async () => {
        let program = ""

        lowerToken == "ArmIn Token" ? program = app.armin_token.id : program = app.armout_token.id

        if (!publicKey) throw new WalletNotConnectedError();
        if (requestRecords) {
            const records = await requestRecords(program);
            const amounts = records.map((record) => {
                return parseInt(record.data.amount.substr(0, record.data.amount.length - 11))

            })
            let sum = 0
            amounts.forEach((num) => {
                sum += num
            })
            setLowerBalance(sum)
            setLowerSpendable(Math.max(...amounts))
        }

    }
    const onChangeUpper = (value: any) => {
        if (value != null)
            setUpperToken(value)

    };
    const onChangeUpperAmount = (value: number | null) => {
        if (value != null)
            setUpperTokenAmount(value)

    }
    const onChangeLowerAmount = (value: number | null) => {
        if (value != null)
            setLowerTokenAmount(value)

    }
    const onChangeLower = (value: any) => {

        setLowerToken(value)

    }
    function tryParseJSON(input: string) {
        try {
            return JSON.parse(input);
        } catch (error) {
            return input;
        }
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (!wallet || !publicKey || !requestTransaction) {
            throw new WalletNotConnectedError()
        }

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

        const txId = await requestTransaction(aleoTransaction);

        setTransactionId(txId);
    };

    if (liquidityTabState===LiquidiyTab.Empty) {
return <EmptyLP liquidityTabState={liquidityTabState} setLiquidityTabState={setLiquidityTabState}/>
    }
    else if(liquidityTabState===LiquidiyTab.UserState){
     return <UserState setLiquidityTabState={setLiquidityTabState} />
    }
    else if(liquidityTabState===LiquidiyTab.Burn){
        return <Burn/>
    }
    else if (liquidityTabState === LiquidiyTab.Supply)  {
        return (
            <div>
                <Cascader options={options}
                    placeholder={"Please select a token"}
                    onChange={(value) => {
                        onChangeUpper(value)

                    }} value={upperToken} />
                <InputNumber onChange={onChangeUpperAmount} value={upperTokenAmount} />
                <br />
                <Button disabled={upperToken == undefined} onClick={async () => {
                    await updateUpperBalance()

                }}>Update Balance</Button >
                <br />
                <>Balanace/spendable {upperBalance}/{upperSpendable}</>
                <br />
                <Cascader options={options} placeholder={"Please select a token"} onChange={(value) => {
                    onChangeLower(value)

                }

                } value={lowerToken} />
                <InputNumber onChange={onChangeLowerAmount} value={lowerTokenAmount} />
                <br />
                <Button disabled={lowerToken == undefined} onClick={async () => {
                    await updateLowerBalance()
                }}>Update Balance</Button>
                <br />
                <>Balanace/spenadble {lowerBalanace}/{lowerSpendable}</>
                <br />
                <>Slippage</>
                <br />
                <>Transaction Fees</>
                <br />
                <>Exhange Rate</>
                <br />
                <>Estimated Amount</>
                <br />
                <>Price Impact</>
                <br />
                <Button disabled={
                    !publicKey ||
                    !functionName ||
                    !inputs ||
                    fee === undefined ||
                    lowerToken === undefined ||
                    upperToken === undefined ||
                    upperToken === lowerToken
                }
                    onClick={handleSubmit}>Supply </Button>


            </div>)

    };
}



