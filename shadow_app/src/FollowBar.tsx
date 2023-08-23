import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faYoutube,
    faGithub,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";

export const FollowBar = () => {
    return (
        <div className="social-container">
            <div>
                <a
                    href="https://youtube.com/@Shadowfi_xyz"
                    className="youtube social"
                >
                    <FontAwesomeIcon icon={faYoutube} size="2x" />
                </a>
                <a
                    href="https://github.com/Armin-FalDis/shadow-finance"
                    className="github social"
                >
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a
                    href="https://twitter.com/Shadowfi_xyz"
                    className="twitter social"
                >
                    <FontAwesomeIcon icon={faTwitter} size="2x" />
                </a>
            </div>
        </div>
    );
};
