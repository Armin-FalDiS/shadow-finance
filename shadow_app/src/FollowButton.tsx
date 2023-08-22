import { useEffect } from "react";
export const FollowButton = () => {
    useEffect(() => {
        const script = document.createElement("script");

        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);
    return (
        <div>
            <a
                style={{ color: "white" }}
                href="https://twitter.com/Shadowfi_xyz?ref_src=twsrc%5Etfw"
                className="twitter-follow-button"
                data-show-count="false"
            >
                @Shadowfi_xyz
            </a>
        </div>
    );
};
