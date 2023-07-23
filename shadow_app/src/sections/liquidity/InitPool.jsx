import { useState, useEffect, useContext } from "react";
import { Button, Card, Col, Form, Row, Result, Space, InputNumber } from "antd";
import axios from "axios";
import init from "@aleohq/wasm";
import { AppContext } from "../../App";
import { node_url, shadow_swap } from "../../app.json";
import { getLPTokenTotalSupply } from "../../general";

await init();

export const InitPool = () => {
    let {
        account,
        fee,
        setFee,
        setArmInToken,
        setArmOutToken,
        armInToken,
        armOutToken,
    } = useContext(AppContext);
    const program = shadow_swap.program;
    const functionID = shadow_swap.init_function;
    const feeAmount = shadow_swap.init_fee;
    const [armInAmount, setArmInAmount] = useState(null);
    const [armOutAmount, setArmOutAmount] = useState(null);

    const [programResponse, setProgramResponse] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [transactionID, setTransactionID] = useState(null);
    const [worker, setWorker] = useState(null);

    const [totalSupply, setTotalSupply] = useState(null);

    function spawnWorker() {
        let worker = new Worker(
            new URL("../../workers/worker.js", import.meta.url),
            { type: "module" },
        );
        worker.addEventListener("message", (ev) => {
            if (ev.data.type == "OFFLINE_EXECUTION_COMPLETED") {
                setTransactionID(null);
                setExecutionError(null);
                setProgramResponse(ev.data.outputs);
            } else if (ev.data.type == "EXECUTION_TRANSACTION_COMPLETED") {
                let [transaction, url] = ev.data.executeTransaction;
                axios
                    .post(
                        url + "/testnet3/transaction/broadcast",
                        transaction,
                        {
                            headers: {
                                "Content-Type": "application/json",
                            },
                        },
                    )
                    .then((res) => {
                        setProgramResponse(null);
                        setExecutionError(null);
                        setTransactionID(res.data);

                        axios
                            .get(`${url}/testnet3/transaction/${transactionID}`)
                            .then((response) => {
                                const tx = response.data;

                                const encyptedFeeRecord =
                                    tx.fee.transition.outputs[0].value;
                                setFee(
                                    account.to_view_key.decrypt(
                                        encyptedFeeRecord,
                                    ),
                                );

                                const encryptedArmInRecord =
                                    tx.execution.transitions[0].outputs[0]
                                        .value;
                                const encryptedArmOutRecord =
                                    tx.execution.transitions[0].outputs[1]
                                        .value;

                                setArmInToken(
                                    account.to_view_key.decrypt(
                                        encryptedArmInRecord,
                                    ),
                                );
                                setArmOutToken(
                                    account.to_view_key.decrypt(
                                        encryptedArmOutRecord,
                                    ),
                                );

                                getLPTokenTotalSupply(
                                    account.to_address().to_string(),
                                ).then((totalSupply) =>
                                    setTotalSupply(totalSupply),
                                );
                            });
                    });
            } else if (ev.data.type == "ERROR") {
                setProgramResponse(null);
                setTransactionID(null);
                setExecutionError(ev.data.errorMessage);
            }
        });
        return worker;
    }

    useEffect(() => {
        if (worker === null) {
            const spawnedWorker = spawnWorker();
            setWorker(spawnedWorker);
            return () => {
                spawnedWorker.terminate();
            };
        }

        if (totalSupply == null) {
            getLPTokenTotalSupply(account.to_address().to_string()).then(
                (totalSupply) => setTotalSupply(totalSupply),
            );
        }
    }, []);

    const onArmInChange = (event) => {
        setArmInAmount(event.target.value);
    };
    const onArmOutChange = (event) => {
        setArmOutAmount(event.target.value);
    };

    function postMessagePromise(worker, message) {
        return new Promise((resolve, reject) => {
            worker.onmessage = (event) => {
                resolve(event.data);
            };
            worker.onerror = (error) => {
                setExecutionError(error);
                setProgramResponse(null);
                setTransactionID(null);
                reject(error);
            };
            worker.postMessage(message);
        });
    }

    const transactionIDString = () =>
        transactionID !== null ? transactionID : "";
    const executionErrorString = () =>
        executionError !== null ? executionError : "";
    const outputString = () =>
        programResponse !== null ? programResponse.toString() : "";

    const execute = async () => {
        setProgramResponse(null);
        setTransactionID(null);
        setExecutionError(null);

        let functionInputs = [
            account.to_address().to_string(),
            armInToken,
            armInAmount,
            armOutToken,
            armOutAmount,
        ];

        await postMessagePromise(worker, {
            type: "ALEO_EXECUTE_PROGRAM_ON_CHAIN",
            remoteProgram: program,
            aleoFunction: functionID,
            inputs: functionInputs,
            privateKey: account.to_string(),
            fee: feeAmount,
            feeRecord: fee,
            url: node_url,
        });
    };

    const layout = { labelCol: { span: 14 }, wrapperCol: { span: 21 } };

    return (
        <Card
            title={"Initalize Liquidity Pool"}
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
        >
            <Form {...layout} disabled={totalSupply}>
                <Row justify="center">
                    <Col justify="center">
                        <Form.Item label="ArmIn amount" colon={false}>
                            <InputNumber
                                size="large"
                                min={1}
                                max={100000}
                                onChange={onArmInChange}
                                value={armInAmount}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <br />
                <Row justify="center">
                    <Col justify="center">
                        <Form.Item label="ArmOut amount" colon={false}>
                            <InputNumber
                                size="large"
                                min={1}
                                max={100000}
                                onChange={onArmOutChange}
                                value={armOutAmount}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <br />
                <Row justify="center">
                    <Col justify="center">
                        <Space>
                            <Button
                                type="primary"
                                shape="round"
                                size="middle"
                                onClick={execute}
                            >
                                Initialize Liquidity Pool
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <br />
            <Row
                justify="center"
                gutter={[16, 32]}
                style={{ marginTop: "48px" }}
            >
                {/* {(loading === true || feeLoading == true) && (
                    <Spin tip={tip} size="large" />
                )} */}
                {transactionID !== null && (
                    <Result
                        status="success"
                        title="On Chain Execution Successful!"
                        subTitle={"Transaction ID: " + transactionIDString()}
                    />
                )}
                {programResponse !== null && (
                    <Result
                        status="success"
                        title="Execution Successful!"
                        subTitle={"Outputs: " + outputString()}
                    />
                )}
                {executionError !== null && (
                    <Result
                        status="error"
                        title="Function Execution Error"
                        subTitle={"Error: " + executionErrorString()}
                    />
                )}
            </Row>
        </Card>
    );
};
