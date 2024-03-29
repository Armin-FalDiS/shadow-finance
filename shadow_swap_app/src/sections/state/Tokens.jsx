import { Card, Divider, Form, Input } from "antd";
import { useContext } from "react";
import { AppContext } from "../../App";

export const Tokens = () => {
    const { armInToken, armOutToken } = useContext(AppContext);

    const layout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } };

    return (
        <Card
            title="Tokens"
            style={{ width: "100%", borderRadius: "20px" }}
            bordered={false}
        >
            <Form {...layout}>
                <Form.Item label="ArmIn Token" colon={false}>
                    <Input
                        name="armInToken"
                        size="large"
                        readOnly
                        value={armInToken}
                    />
                </Form.Item>
                <Divider />
                <Form.Item label="ArmOut Token" colon={false}>
                    <Input
                        name="armOutToken"
                        size="large"
                        readOnly
                        value={armOutToken}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};
