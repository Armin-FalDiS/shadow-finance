import { useState, useEffect, useContext } from "react";
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Result,
    Spin,
    Switch,
    Space,
} from "antd";
import { FormGenerator } from "../../components/InputForm";
import axios from "axios";
import init, * as aleo from "@aleohq/wasm";
import { AppContext } from "../../App";
import { armin_token, node_url } from "../../app.json";

await init();

export const ArmInToken = () => {
    let { account, fee, setFee } = useContext(AppContext);
    const program = armin_token.program;
    const functionID = armin_token.mint_function;
    const feeAmount = armin_token.mint_fee;

    const [programResponse, setProgramResponse] = useState(null);
    const [executionError, setExecutionError] = useState(null);
    const [transactionID, setTransactionID] = useState(null);
    const [worker, setWorker] = useState(null);

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
                    .then((response) => {
                        setProgramResponse(null);
                        setExecutionError(null);
                        setTransactionID(response.data);
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
    }, []);

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
            Math.floor(Math.random() * 100000) + 1 + "u64",
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

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
        <Card
            title={"Mint Armin Token"}
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
        >
            <Form {...layout}>
                <Row justify="center">
                    <Col justify="center">
                        <Space>
                            <Button
                                type="primary"
                                shape="round"
                                size="middle"
                                onClick={execute}
                            >
                                Get Armin Token
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <Row
                justify="center"
                gutter={[16, 32]}
                style={{ marginTop: "48px" }}
            >
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
