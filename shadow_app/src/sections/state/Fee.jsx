import { Card, Divider, Form, Input } from "antd";
import { CopyButton } from "../../components/CopyButton";
import { useAleoWASM } from "../../aleo-wasm-hook";
import { useContext } from "react";
import { AppContext } from "../../App";

export const Fee = () => {
    const { account, fee, setFee } = useContext(AppContext);
    const aleo = useAleoWASM();

    const onChange = (event) => {
        setFee(null);
        try {
            if (event.target.value && account) {
                setFee(
                    account.to_view_key().decrypt(event.target.value),
                );
            }
        } catch (error) {
            console.error(error);
        }
    };

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };
    if (aleo !== null) {
        return (
            <Card
                title="Fee"
                style={{ width: "100%", borderRadius: "20px" }}
                bordered={false}
            >
                <Form {...layout}>
                    <Form.Item label="Fee Record (Encrypted)" colon={false}>
                        <Input
                            name="feeRecordEncrypted"
                            size="large"
                            placeholder="record1..."
                            allowClear
                            onChange={onChange}
                            style={{ borderRadius: "20px" }}
                        />
                    </Form.Item>
                    <Divider />
                    <Form.Item label="Fee Record" colon={false}>
                        <Input
                            name="feeRecord"
                            size="large"
                            placeholder="{ owner: aleo1..., microcredits: Xu64, _nonce: 12345field }"
                            allowClear
                            value={fee}
                            style={{ borderRadius: "20px" }}
                        />
                    </Form.Item>
                </Form>
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
