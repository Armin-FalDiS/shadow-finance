import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faGithub,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Col, Row } from "antd";

export const FollowBar = () => {
    return (
        <div className="social-container" style={{ marginTop: "2%", marginRight: "3%" }}>
            <Row justify="end">
                <Col>
                    <a
                        href="https://youtube.com/@Shadowfi_xyz"
                        className="youtube social"
                    >
                        <FontAwesomeIcon icon={faYoutube} size="2x" />
                    </a>
                </Col>
                <Col>
                    <a
                        href="https://github.com/Armin-FalDis/shadow-finance"
                        className="github social"
                        style={{ marginLeft: "24px", marginRight: "24px" }}
                    >
                        <FontAwesomeIcon icon={faGithub} size="2x" />
                    </a>
                </Col>
                <Col>
                    <a
                        href="https://twitter.com/Shadowfi_xyz"
                        className="twitter social"
                    >
                        <FontAwesomeIcon icon={faTwitter} size="2x" />
                    </a>
                </Col>
            </Row>
        </div>
    );
};
