import React, { useState } from "react";
import { Button, Cascader, InputNumber, Form, Row, Col } from "antd";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import app from "./app.json";
import {
    WalletAdapterNetwork,
    WalletNotConnectedError,
    Transaction,
} from "@demox-labs/aleo-wallet-adapter-base";

interface Option {
    value: string;
    label: string;
}

const Swap = () => {
    const { wallet, publicKey, requestRecords, requestTransaction } =
        useWallet();

    const options: Option[] = [
        {
            value: "ArmIn Token",
            label: "ArmIn Token",
        },
        {
            value: "ArmOut Token",
            label: "ArmOut Token",
        },
    ];
    enum Tokens {
        ArmInToken = "ArmIn Token",
        ArmOutToken = "ArmOut Token",
    }

    const [programId] = useState(app.shadow_swap.id);
    const [functionName, setFunctionName] = useState(
        app.shadow_swap.swap_to_0_function
    );
    const [fee] = useState(app.shadow_swap.swap_to_0_fee);
    const [upperToken, setUpperToken] = useState<any>();
    const [lowerToken, setLowerToken] = useState<any>();
    const [upperTokenAmount, setUpperTokenAmount] = useState(0);
    const [lowerTokenAmount, setLowerTokenAmount] = useState(0);
    const [upperBalance, setUpperBalance] = useState(0);
    const [lowerSpendable, setLowerSpendable] = useState(0);
    const [upperSpendable, setUpperSpendable] = useState(0);
    const [lowerBalanace, setLowerBalance] = useState(0);
    const [_, setTransactionId] = useState<string>();

    const updateUpperBalance = async () => {
        let program = "";

        upperToken == "ArmIn Token"
            ? (program = app.armin_token.id)
            : (program = app.armout_token.id);

        if (!publicKey) throw new WalletNotConnectedError();
        if (requestRecords != null) {
            let records = await requestRecords(program);
            records = records.filter((record) => {
                return record.spent === false;
            });
            const amounts = records.map((record) => {
                return parseInt(
                    record.data.amount.substr(0, record.data.amount.length - 11)
                );
            });
            let sum = 0;
            amounts.forEach((num) => {
                sum += num;
            });
            setUpperBalance(sum);
            setUpperSpendable(Math.max(...amounts));
        }
    };
    const updateLowerBalance = async () => {
        let program = "";

        lowerToken == "ArmIn Token"
            ? (program = app.armin_token.id)
            : (program = app.armout_token.id);

        if (!publicKey) throw new WalletNotConnectedError();
        if (requestRecords != null) {
            let records = await requestRecords(program);
            records = records.filter((record) => {
                return record.spent === false;
            });
            const amounts = records.map((record) => {
                return parseInt(
                    record.data.amount.substr(0, record.data.amount.length - 11)
                );
            });

            let sum = 0;
            amounts.forEach((num) => {
                sum += num;
            });
            setLowerBalance(sum);
            setLowerSpendable(Math.max(...amounts));
        }
    };
    const onChangeUpper = (value: any) => {
        if (value != null) setUpperToken(value);
    };
    const onChangeUpperAmount = (value: number | null) => {
        if (value != null) setUpperTokenAmount(value);
    };
    const onChangeLowerAmount = (value: number | null) => {
        if (value != null) setLowerTokenAmount(value);
    };
    const onChangeLower = (value: any) => {
        setLowerToken(value);
    };
    function tryParseJSON(input: string) {
        try {
            return JSON.parse(input);
        } catch (error) {
            return input;
        }
    }
    const getIndexOfHighestRecord = (records: any[]) => {
        const amounts = records.map((record) => {
            return parseInt(
                record.data.amount.substr(0, record.data.amount.length - 11)
            );
        });
        return amounts.indexOf(Math.max.apply(Math, amounts));
    };

    const handleSubmit = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        if (wallet == null || !publicKey || requestTransaction == null) {
            throw new WalletNotConnectedError();
        }
        let inputsArray: any[] = [];
        if (requestRecords != null) {
            let armInRecords = await requestRecords(app.armin_token.id);
            let armOutRecords = await requestRecords(app.armout_token.id);
            armInRecords = armInRecords.filter((record) => {
                return record.spent === false;
            });
            armOutRecords = armOutRecords.filter((record) => {
                return record.spent === false;
            });
            const arminSpendableIndex = getIndexOfHighestRecord(armInRecords);
            const armOutSpendableIndex = getIndexOfHighestRecord(armOutRecords);

            if (upperToken == Tokens.ArmInToken) {
                setFunctionName(app.shadow_swap.swap_to_1_function);
                inputsArray = [
                    publicKey,
                    armInRecords[arminSpendableIndex],
                    upperTokenAmount + "u64",
                    lowerTokenAmount + "u64",
                ];
            } else if (upperToken == Tokens.ArmInToken) {
                setFunctionName(app.shadow_swap.swap_to_0_function);
                inputsArray = [
                    publicKey,
                    armOutRecords[armOutSpendableIndex],
                    upperTokenAmount + "u64",
                    lowerTokenAmount + "u64",
                ];
            }

            const parsedInputs = inputsArray.map((input) =>
                tryParseJSON(input)
            );

            const aleoTransaction = Transaction.createTransaction(
                publicKey,
                WalletAdapterNetwork.Testnet,
                programId,
                functionName,
                parsedInputs,
                fee
            );
            console.log(parsedInputs);
            console.log(aleoTransaction);

            const txId = await requestTransaction(aleoTransaction);

            setTransactionId(txId);
        }
    };

    return (

        <>
            <Row>
                <Col>
                    <Form>
                        <Form.Item>
                            <Cascader
                                options={options}
                                placeholder={"Please select a token"}
                                onChange={(value) => {
                                    onChangeUpper(value);
                                }}
                                value={upperToken}
                            />
                            <InputNumber
                                onChange={onChangeUpperAmount}
                                value={upperTokenAmount}
                            />
                        </Form.Item>
                        <Button
                            disabled={upperToken == undefined}
                            onClick={async () => {
                                await updateUpperBalance();
                            }}
                        >
                            Update Balance
                        </Button>

                        <Col>
                            Balanace/spendable {upperBalance}/{upperSpendable}
                        </Col>

                        <Form.Item>
                            <Cascader
                                options={options}
                                placeholder={"Please select a token"}
                                onChange={(value) => {
                                    onChangeLower(value);
                                }}
                                value={lowerToken}
                            />
                            <InputNumber
                                onChange={onChangeLowerAmount}
                                value={lowerTokenAmount}
                            />
                        </Form.Item>
                        <Button
                            disabled={lowerToken == undefined}
                            onClick={async () => {
                                await updateLowerBalance();
                            }}
                        >
                            Update Balance
                        </Button>

                        <Col>
                            Balanace/spenadble {lowerBalanace}/{lowerSpendable}
                        </Col>

                        <Col>Slippage</Col>

                        <Col>Transaction Fees</Col>

                        <Col>Exhange Rate</Col>

                        <Col>Estimated Amount</Col>

                        <Col>Price Impact</Col>


                        <Button
                            disabled={
                                !publicKey ||
                                !functionName ||
                                fee === undefined ||
                                lowerToken === undefined ||
                                upperToken === undefined ||
                                upperToken.toString() === lowerToken.toString() ||
                                upperTokenAmount === 0 ||
                                lowerTokenAmount === 0
                            }
                            onClick={handleSubmit}
                        >
                            Swap{" "}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    );
};

export default Swap;
