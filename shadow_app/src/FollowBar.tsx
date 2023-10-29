import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faGithub,
    faTwitter,
    faMedium,
    faDiscord,
} from "@fortawesome/free-brands-svg-icons";
import { Col, Row } from "antd";

export const FollowBar = () => {
    return (
        <div
            className="social-container"
            style={{ marginTop: "2%", marginRight: "3%" }}
        >
            <Row justify="end">
                <Col>
                    <a
                        href="https://shadowfi.xyz/discord/"
                        className="discord social"
                        style={{ marginRight: "24px" }}
                    >
                        <FontAwesomeIcon icon={faDiscord} size="2x" />
                    </a>
                </Col>
                <Col>
                    <a
                        href="https://medium.com/@shadowfi.xyz"
                        className="medium social"
                        style={{ marginRight: "24px" }}
                    >
                        <FontAwesomeIcon icon={faMedium} size="2x" />
                    </a>
                </Col>
                <Col>
                    <a
                        href="https://youtube.com/@Shadowfi_xyz"
                        className="youtube social"
                        style={{ marginRight: "24px" }}
                    >
                        <FontAwesomeIcon icon={faYoutube} size="2x" />
                    </a>
                </Col>
                <Col>
                    <a
                        href="https://github.com/Armin-FalDis/shadow-finance"
                        className="github social"
                        style={{ marginRight: "24px" }}
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
