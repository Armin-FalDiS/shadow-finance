import { Card, Divider, Form, Input, Row, Col, Button } from "antd";
import { CopyButton } from "../../components/CopyButton";
import { useAleoWASM } from "../../aleo-wasm-hook";
import { useContext } from "react";
import { AppContext } from "../../App";
import { useState } from "react";

export const Account = () => {
    const { account, setAccount, setFee, setArmInToken, setArmOutToken } = useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const aleo = useAleoWASM();
    
    const generateAccount = async () => {
        setLoading(true);
        setFee(null);
        setArmInToken(null);
        setArmOutToken(null);
        setTimeout(() => {
            setAccount(new aleo.PrivateKey());
            setLoading(false);
        }, 25);
    };

    const onChange = (event) => {
        setAccount(null);
        try {
            setAccount(aleo.PrivateKey.from_string(event.target.value));
        } catch (error) {
            console.error(error);
        }
    };

    const clear = () => {
        setAccount(null);
        setFee(null);
        setArmInToken(null);
        setArmOutToken(null);
    };
    
    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    if (aleo !== null) {
        const viewKey = () =>
            account !== null ? account.to_view_key().to_string() : "";
        const address = () =>
            account !== null ? account.to_address().to_string() : "";

        return (
            <Card
                title="Account Information"
                style={{ width: "100%", borderRadius: "20px" }}
                bordered={false}
            >
                <Row justify="center">
                    <Col>
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            onClick={generateAccount}
                            loading={!!loading}
                        >
                            Generate New Account
                        </Button>
                    </Col>
                    <Col offset="1">
                        <Button shape="round" size="large" onClick={clear}>
                            Clear
                        </Button>
                    </Col>
                </Row>
                <br />
                <Form {...layout}>
                    <Form.Item label="Private Key" colon={false}>
                        <Input
                            name="privateKey"
                            size="large"
                            placeholder="Private Key"
                            allowClear
                            onChange={onChange}
                            style={{ borderRadius: "20px" }}
                        />
                    </Form.Item>
                </Form>
                {account !== null ? (
                    <Form {...layout}>
                        <Divider />
                        <Form.Item label="View Key" colon={false}>
                            <Input
                                size="large"
                                placeholder="View Key"
                                value={viewKey()}
                                addonAfter={
                                    <CopyButton
                                        data={viewKey()}
                                        style={{ borderRadius: "20px" }}
                                    />
                                }
                                disabled
                            />
                        </Form.Item>
                        <Form.Item label="Address" colon={false}>
                            <Input
                                size="large"
                                placeholder="Address"
                                value={address()}
                                addonAfter={
                                    <CopyButton
                                        data={address()}
                                        style={{ borderRadius: "20px" }}
                                    />
                                }
                                disabled
                            />
                        </Form.Item>
                    </Form>
                ) : null}
            </Card>
        );
    } else {
        return (
            <h3>
                <center>Loading...</center>
            </h3>
        );
    }
};
