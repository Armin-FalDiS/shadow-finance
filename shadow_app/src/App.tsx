import { useMemo, useState } from "react";
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import {
    WalletModalProvider,
    WalletMultiButton,
} from "@demox-labs/aleo-wallet-adapter-reactui";
import { MintArmIn } from "./MintArmIn";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import {
    DecryptPermission,
    WalletAdapterNetwork,
} from "@demox-labs/aleo-wallet-adapter-base";
import { MintArmOut } from "./MintArmOut";
import Swap from "./Swap";
import { Col, Row, Button } from "antd";

import "@demox-labs/aleo-wallet-adapter-reactui/styles.css";
import "./App.css";
import { Liquidity } from "./liquidity";
import { FollowBar } from "./FollowBar";

enum NavTab {
    "Swap",
    "Liquidity",
}

export const App = () => {
    const wallets = useMemo(
        () => [
            new LeoWalletAdapter({
                appName: "Shadow Finance",
            }),
        ],
        []
    );
    const [tab, setTab] = useState(NavTab.Swap);

    const handleNavigationTabChange = (selectedTab: string) => {
        if (selectedTab == "swap") {
            document
                .getElementById("swap-tab-btn")
                ?.classList.remove("tab-btn-unchecked");
            document
                .getElementById("liquidity-tab-btn")
                ?.classList.add("tab-btn-unchecked");
            setTab(NavTab.Swap);
        } else {
            document
                .getElementById("swap-tab-btn")
                ?.classList.add("tab-btn-unchecked");
            document
                .getElementById("liquidity-tab-btn")
                ?.classList.remove("tab-btn-unchecked");
            setTab(NavTab.Liquidity);
        }
    };

    return (
        <WalletProvider
            wallets={wallets}
            decryptPermission={DecryptPermission.UponRequest}
            network={WalletAdapterNetwork.Testnet}
            autoConnect
        >
            <FollowBar />
            <WalletModalProvider>
                <header style={{ margin: "0 3% 3%" }}>
                    <Row align={"middle"}>
                        <Col
                            span={6}
                            style={{ display: "flex", justifyContent: "start" }}
                        >
                            <div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="128"
                                    height="128"
                                    viewBox="0 0 128 128"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="m98.96,70.37c2.16,-1.25 3.25,-1.88 3.92,-2.85c0.21,-0.3 0.38,-0.62 0.52,-0.95c0.46,-1.09 0.42,-2.34 0.33,-4.84l-0.84,-23.97c-0.1,-2.75 -0.14,-4.13 -0.8,-5.28c-0.66,-1.14 -1.82,-1.87 -4.16,-3.33l-20.3,-12.71c-2.12,-1.33 -3.18,-1.99 -4.35,-2.13c-0.36,-0.04 -0.72,-0.05 -1.08,-0.02c-1.17,0.1 -2.26,0.73 -4.42,1.98c-3.48,2.01 -5.22,3.02 -5.91,4.62c-0.21,0.48 -0.35,1 -0.41,1.52c-0.2,1.73 0.81,3.47 2.82,6.96l21.61,37.5c2.01,3.48 3.01,5.22 4.61,5.92c0.48,0.21 0.99,0.35 1.52,0.41c1.73,0.2 3.47,-0.81 6.95,-2.82l-0.01,-0.01zm9.34,-47.21c2.33,1.46 3.5,2.19 4.16,3.33c0.66,1.14 0.71,2.52 0.8,5.27l1.23,35.35c0.11,3.1 0.16,4.65 -0.55,5.93c-0.71,1.29 -2.05,2.06 -4.73,3.61l-13.26,7.67c-4.31,2.49 -6.47,3.74 -8.58,3.18c-2.11,-0.57 -3.36,-2.73 -5.85,-7.05l-31.18,-54.1c-2.49,-4.32 -3.74,-6.48 -3.17,-8.6c0.57,-2.12 2.72,-3.37 7.04,-5.86l13.26,-7.67c2.68,-1.55 4.02,-2.32 5.48,-2.3c1.47,0.03 2.78,0.85 5.4,2.49l29.94,18.75l0.01,0z"
                                        fill="#EC8924"
                                        fillRule="evenodd"
                                    />
                                    <path
                                        clipRule="evenodd"
                                        d="m59.38,93.42c-2.16,1.25 -3.25,1.88 -4.42,1.98c-0.36,0.03 -0.72,0.02 -1.08,-0.02c-1.17,-0.14 -2.23,-0.81 -4.35,-2.13l-20.3,-12.71c-2.33,-1.46 -3.5,-2.19 -4.16,-3.33c-0.66,-1.14 -0.71,-2.52 -0.8,-5.28l-0.84,-23.97c-0.09,-2.51 -0.13,-3.76 0.33,-4.84c0.14,-0.33 0.32,-0.65 0.52,-0.95c0.67,-0.97 1.76,-1.59 3.92,-2.85c3.48,-2.01 5.22,-3.02 6.95,-2.82c0.52,0.06 1.03,0.2 1.52,0.41c1.6,0.7 2.6,2.44 4.61,5.92l21.61,37.5c2.01,3.48 3.01,5.22 2.82,6.96c-0.06,0.52 -0.2,1.04 -0.41,1.52c-0.69,1.6 -2.43,2.6 -5.91,4.62l-0.01,-0.01zm-45.48,-15.5c0.1,2.75 0.15,4.13 0.8,5.28c0.66,1.14 1.82,1.87 4.16,3.33l29.94,18.75c2.62,1.64 3.94,2.46 5.4,2.49c1.47,0.02 2.81,-0.75 5.48,-2.3l13.26,-7.67c4.31,-2.49 6.47,-3.74 7.04,-5.86c0.57,-2.12 -0.68,-4.28 -3.17,-8.6l-31.18,-54.1c-2.49,-4.32 -3.74,-6.48 -5.85,-7.05c-2.11,-0.57 -4.27,0.68 -8.58,3.18l-13.26,7.67c-2.68,1.55 -4.02,2.33 -4.73,3.61c-0.71,1.28 -0.66,2.83 -0.55,5.93l1.23,35.35l0.01,-0.01z"
                                        fill="#EC8924"
                                        fillRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div style={{ display: "flex" }}>
                                <svg
                                    id="logo-text"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="223"
                                    height="19"
                                    viewBox="0 0 223 19"
                                >
                                    <path
                                        d="M9.82515 18.5C7.87248 18.5 6.1917 18.2999 4.78281 17.8996C3.38216 17.4913 2.27812 16.8949 1.47068 16.1104C0.663249 15.3259 0.181261 14.3732 0.0247174 13.2525L0 13.0964H3.96714L3.99185 13.2165C4.13192 13.7208 4.445 14.1491 4.93111 14.5013C5.42546 14.8456 6.08871 15.1097 6.92086 15.2939C7.76125 15.47 8.77466 15.558 9.96109 15.558C10.9663 15.558 11.8231 15.466 12.5317 15.2819C13.2485 15.0897 13.7964 14.8135 14.1754 14.4533C14.5626 14.0931 14.7563 13.6688 14.7563 13.1805V13.1684C14.7563 12.536 14.4926 12.0677 13.9653 11.7635C13.438 11.4513 12.5276 11.2231 11.234 11.0791L6.88378 10.7308C4.70866 10.5227 3.08967 10.0183 2.02682 9.21781C0.963977 8.41728 0.432554 7.30454 0.432554 5.87959V5.86758C0.432554 4.76284 0.782716 3.81021 1.48304 3.00967C2.19161 2.20914 3.19678 1.59273 4.49856 1.16044C5.80034 0.720147 7.34517 0.5 9.13306 0.5C10.9621 0.5 12.5399 0.704136 13.8664 1.11241C15.1929 1.52068 16.2393 2.11708 17.0055 2.9016C17.78 3.67812 18.2496 4.61474 18.4144 5.71147L18.4391 5.89159H14.4844L14.4473 5.77151C14.299 5.25117 14.0065 4.81888 13.5698 4.47465C13.1414 4.13042 12.5564 3.87425 11.8149 3.70614C11.0816 3.53002 10.1877 3.44196 9.13306 3.44196C8.13613 3.44196 7.29162 3.53402 6.59953 3.71815C5.91569 3.89426 5.39662 4.15043 5.04234 4.48666C4.68806 4.81488 4.51092 5.20714 4.51092 5.66344V5.67545C4.51092 6.26785 4.77869 6.72015 5.31423 7.03235C5.85801 7.34456 6.7396 7.56471 7.95899 7.6928L12.3587 8.04103C13.8417 8.19313 15.057 8.46531 16.0045 8.85757C16.9602 9.24983 17.6688 9.78219 18.1302 10.4546C18.5998 11.1191 18.8346 11.9356 18.8346 12.9043V12.9163C18.8346 14.0851 18.4803 15.0897 17.7718 15.9303C17.0632 16.7628 16.0374 17.3993 14.6945 17.8396C13.3515 18.2799 11.7284 18.5 9.82515 18.5Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M20.948 18.1638V0.836224H24.878V7.90894H24.9522C25.4218 7.02035 26.1304 6.32388 27.0779 5.81955C28.0254 5.31521 29.1541 5.06304 30.4641 5.06304C31.7247 5.06304 32.8041 5.2992 33.7021 5.77151C34.6002 6.23582 35.2881 6.90827 35.766 7.78886C36.2521 8.66144 36.4952 9.71414 36.4952 10.947V18.1638H32.5651V11.7035C32.5651 10.4867 32.2561 9.56204 31.6382 8.92962C31.0203 8.28919 30.1222 7.96898 28.944 7.96898C28.1201 7.96898 27.4033 8.12909 26.7936 8.4493C26.1839 8.76151 25.7102 9.2058 25.3724 9.78219C25.0428 10.3586 24.878 11.039 24.878 11.8235V18.1638H20.948Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M44.2193 18.3799C43.0494 18.3799 42.0277 18.2278 41.1544 17.9236C40.2893 17.6114 39.6178 17.1591 39.1399 16.5667C38.6621 15.9663 38.4231 15.2418 38.4231 14.3933V14.3692C38.4231 13.6248 38.6209 12.9763 39.0163 12.4239C39.4118 11.8716 40.0339 11.4353 40.8825 11.1151C41.7311 10.7949 42.8352 10.6227 44.1946 10.5987L51.7334 10.4426V12.52L44.8002 12.6761C43.9269 12.7001 43.2883 12.8442 42.8846 13.1084C42.4891 13.3646 42.2914 13.7208 42.2914 14.1771V14.1891C42.2914 14.7655 42.5674 15.1938 43.1194 15.474C43.6797 15.7542 44.413 15.8943 45.3193 15.8943C46.2173 15.8943 46.9959 15.7742 47.6551 15.534C48.3142 15.2939 48.825 14.9576 49.1875 14.5254C49.5583 14.0931 49.7437 13.5847 49.7437 13.0003V10.1304C49.7437 9.36191 49.4388 8.76951 48.8291 8.35324C48.2277 7.92895 47.3667 7.71681 46.2462 7.71681C45.2575 7.71681 44.4706 7.87292 43.8857 8.18512C43.3089 8.48933 42.9423 8.9016 42.7857 9.42195L42.761 9.53002H39.0411L39.0658 9.38592C39.2141 8.54536 39.589 7.80087 40.1904 7.15243C40.7919 6.504 41.6034 5.99566 42.6251 5.62742C43.655 5.25117 44.8826 5.06304 46.308 5.06304C47.8487 5.06304 49.1669 5.26318 50.2627 5.66344C51.3668 6.06371 52.2113 6.63609 52.7963 7.38059C53.3813 8.12508 53.6737 9.01368 53.6737 10.0464V18.1638H49.7437V16.0143H49.6695C49.3647 16.5027 48.9445 16.9229 48.4089 17.2752C47.8734 17.6274 47.2472 17.8996 46.5304 18.0917C45.8219 18.2839 45.0515 18.3799 44.2193 18.3799Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M62.6585 18.464C61.2249 18.464 59.9767 18.1838 58.9138 17.6234C57.8592 17.063 57.0435 16.2825 56.4668 15.2819C55.8901 14.2732 55.6017 13.1044 55.6017 11.7755V11.7515C55.6017 10.4226 55.8901 9.25784 56.4668 8.25717C57.0435 7.2485 57.8592 6.46398 58.9138 5.9036C59.9767 5.34323 61.2208 5.06304 62.6461 5.06304C63.5689 5.06304 64.4011 5.17512 65.1426 5.39927C65.8841 5.62342 66.5268 5.93963 67.0705 6.3479C67.6226 6.74817 68.0675 7.21247 68.4053 7.74083H68.4794V0.836224H72.4095V18.1638H68.4794V15.7982H68.4053C68.0675 16.3266 67.6267 16.7909 67.0829 17.1911C66.5391 17.5914 65.8965 17.9036 65.155 18.1278C64.4134 18.3519 63.5813 18.464 62.6585 18.464ZM64.0056 15.6421C64.9119 15.6421 65.6987 15.486 66.3661 15.1738C67.0417 14.8536 67.5608 14.4053 67.9233 13.8289C68.2941 13.2445 68.4794 12.56 68.4794 11.7755V11.7515C68.4794 10.975 68.2941 10.2985 67.9233 9.72215C67.5525 9.13776 67.0335 8.68946 66.3661 8.37725C65.6987 8.05704 64.9119 7.89693 64.0056 7.89693C63.0911 7.89693 62.3042 8.05304 61.6451 8.36524C60.9942 8.66945 60.4916 9.10974 60.1373 9.68612C59.783 10.2625 59.6059 10.951 59.6059 11.7515V11.7755C59.6059 12.5761 59.783 13.2645 60.1373 13.8409C60.4916 14.4173 60.9942 14.8616 61.6451 15.1738C62.3042 15.486 63.0911 15.6421 64.0056 15.6421Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M82.7661 18.464C81.0853 18.464 79.6187 18.1918 78.3664 17.6474C77.114 17.1031 76.1418 16.3306 75.4497 15.3299C74.7576 14.3292 74.4116 13.1444 74.4116 11.7755V11.7515C74.4116 10.3826 74.7576 9.1978 75.4497 8.19713C76.1501 7.19646 77.1264 6.42395 78.3787 5.87959C79.6311 5.33522 81.0935 5.06304 82.7661 5.06304C84.4468 5.06304 85.9134 5.33522 87.1658 5.87959C88.4181 6.42395 89.3903 7.19646 90.0824 8.19713C90.7827 9.1978 91.1329 10.3826 91.1329 11.7515V11.7755C91.1329 13.1524 90.7827 14.3412 90.0824 15.3419C89.3903 16.3346 88.4181 17.1031 87.1658 17.6474C85.9134 18.1918 84.4468 18.464 82.7661 18.464ZM82.7784 15.6901C83.6353 15.6901 84.3892 15.538 85.0401 15.2338C85.6992 14.9216 86.21 14.4773 86.5725 13.9009C86.9351 13.3165 87.1163 12.6081 87.1163 11.7755V11.7515C87.1163 10.927 86.9351 10.2225 86.5725 9.63809C86.21 9.0537 85.6992 8.60941 85.0401 8.3052C84.3892 8.001 83.6312 7.8489 82.7661 7.8489C81.9092 7.8489 81.1512 8.005 80.4921 8.31721C79.8412 8.62141 79.3304 9.06571 78.9596 9.6501C78.5971 10.2265 78.4158 10.927 78.4158 11.7515V11.7755C78.4158 12.6081 78.5971 13.3165 78.9596 13.9009C79.3304 14.4773 79.8412 14.9216 80.4921 15.2338C81.1512 15.538 81.9133 15.6901 82.7784 15.6901Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M96.7932 18.1638L91.9362 5.36324H95.9157L99.0301 14.7415H99.1042L102.676 5.36324H106.359L109.943 14.7415H110.005L113.119 5.36324H117.074L112.229 18.1638H108.052L104.542 9.16978H104.468L100.97 18.1638H96.7932Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M125.379 18.1638V0.836224H139.925V1.79686H126.491V8.94163H139.01V9.87825H126.491V18.1638H125.379Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M142.323 18.1638V5.66344H143.41V18.1638H142.323ZM142.866 3.23783C142.644 3.23783 142.454 3.16578 142.298 3.02168C142.141 2.87759 142.063 2.69746 142.063 2.48132C142.063 2.27318 142.141 2.09706 142.298 1.95297C142.454 1.80087 142.644 1.72482 142.866 1.72482C143.089 1.72482 143.278 1.80087 143.435 1.95297C143.591 2.09706 143.67 2.27318 143.67 2.48132C143.67 2.69746 143.591 2.87759 143.435 3.02168C143.278 3.16578 143.089 3.23783 142.866 3.23783Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M146.364 18.1638V5.66344H147.439V9.01368H147.476C147.88 7.94096 148.613 7.07638 149.676 6.41995C150.739 5.76351 152.012 5.43529 153.495 5.43529C155.398 5.43529 156.881 5.95163 157.944 6.98432C159.007 8.01701 159.538 9.46198 159.538 11.3192V18.1638H158.451V11.4393C158.451 9.8062 157.997 8.55337 157.091 7.68079C156.193 6.8002 154.92 6.35991 153.272 6.35991C152.102 6.35991 151.077 6.58806 150.195 7.04436C149.322 7.50067 148.642 8.14109 148.156 8.96564C147.678 9.79019 147.439 10.7548 147.439 11.8596V18.1638H146.364Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M167.707 18.3799C166.546 18.3799 165.532 18.2318 164.667 17.9356C163.802 17.6394 163.13 17.2111 162.653 16.6508C162.175 16.0904 161.936 15.4139 161.936 14.6214V14.5974C161.936 13.8769 162.133 13.2645 162.529 12.7602C162.924 12.2558 163.522 11.8636 164.321 11.5834C165.128 11.3032 166.142 11.1471 167.361 11.1151L174.529 10.9229V11.7395L167.472 11.9436C165.998 11.9837 164.889 12.2278 164.148 12.6761C163.406 13.1164 163.036 13.7528 163.036 14.5854V14.5974C163.036 15.502 163.476 16.2105 164.358 16.7228C165.24 17.2352 166.405 17.4913 167.856 17.4913C169.058 17.4913 170.117 17.3032 171.032 16.927C171.955 16.5427 172.675 16.0183 173.195 15.3539C173.722 14.6815 173.985 13.9089 173.985 13.0364V10.2025C173.985 8.95364 173.541 8.001 172.651 7.34456C171.769 6.68012 170.517 6.3479 168.894 6.3479C167.46 6.3479 166.282 6.60407 165.359 7.11641C164.436 7.62075 163.843 8.33322 163.579 9.25384L163.555 9.37392H162.492L162.517 9.25384C162.681 8.47732 163.044 7.80487 163.604 7.23649C164.164 6.66011 164.894 6.21581 165.792 5.9036C166.698 5.59139 167.732 5.43529 168.894 5.43529C170.187 5.43529 171.291 5.61941 172.206 5.98766C173.129 6.3559 173.837 6.89226 174.332 7.59673C174.826 8.2932 175.073 9.13776 175.073 10.1304V18.1638H173.985V15.2458H173.948C173.66 15.8783 173.211 16.4306 172.601 16.9029C172 17.3752 171.279 17.7395 170.439 17.9957C169.606 18.2518 168.696 18.3799 167.707 18.3799Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M177.829 18.1638V5.66344H178.904V9.01368H178.941C179.345 7.94096 180.078 7.07638 181.141 6.41995C182.204 5.76351 183.477 5.43529 184.96 5.43529C186.863 5.43529 188.346 5.95163 189.409 6.98432C190.472 8.01701 191.003 9.46198 191.003 11.3192V18.1638H189.916V11.4393C189.916 9.8062 189.463 8.55337 188.556 7.68079C187.658 6.8002 186.385 6.35991 184.738 6.35991C183.568 6.35991 182.542 6.58806 181.66 7.04436C180.787 7.50067 180.107 8.14109 179.621 8.96564C179.143 9.79019 178.904 10.7548 178.904 11.8596V18.1638H177.829Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M200.433 18.3919C198.991 18.3919 197.718 18.1237 196.614 17.5874C195.518 17.051 194.662 16.2985 194.044 15.3299C193.434 14.3612 193.129 13.2245 193.129 11.9196V11.8956C193.129 10.5907 193.434 9.45397 194.044 8.48532C194.662 7.51668 195.518 6.76818 196.614 6.23983C197.718 5.70347 198.991 5.43529 200.433 5.43529C201.677 5.43529 202.769 5.61541 203.708 5.97565C204.647 6.33589 205.414 6.83222 206.007 7.46464C206.6 8.08906 207.004 8.80954 207.218 9.62608L207.243 9.74616H206.143L206.118 9.63809C205.788 8.66144 205.146 7.87292 204.19 7.27252C203.234 6.66411 201.986 6.35991 200.445 6.35991C199.21 6.35991 198.122 6.58406 197.183 7.03235C196.252 7.48065 195.527 8.12108 195.008 8.95364C194.489 9.78619 194.229 10.7708 194.229 11.9076V11.9196C194.229 13.0564 194.489 14.041 195.008 14.8736C195.527 15.6981 196.256 16.3386 197.195 16.7949C198.134 17.2432 199.218 17.4673 200.445 17.4673C201.978 17.4673 203.222 17.1671 204.178 16.5667C205.133 15.9663 205.776 15.1698 206.106 14.1771L206.143 14.0811H207.243L207.206 14.1891C206.991 15.0217 206.584 15.7542 205.982 16.3866C205.389 17.011 204.627 17.5033 203.696 17.8636C202.765 18.2158 201.677 18.3919 200.433 18.3919Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M216.042 18.3919C214.526 18.3919 213.22 18.1358 212.124 17.6234C211.029 17.1031 210.188 16.3586 209.603 15.3899C209.018 14.4133 208.726 13.2485 208.726 11.8956V11.8836C208.726 10.5707 209.022 9.43396 209.616 8.47332C210.217 7.50467 211.053 6.75617 212.124 6.22782C213.204 5.69947 214.46 5.43529 215.894 5.43529C217.344 5.43529 218.596 5.69947 219.651 6.22782C220.714 6.74817 221.538 7.47665 222.123 8.41328C222.708 9.3499 223 10.4466 223 11.7035V12.0997H209.27V11.2592H222.407L221.937 11.9556V11.6554C221.937 10.5827 221.69 9.6501 221.196 8.85757C220.701 8.05704 220.001 7.44063 219.095 7.00834C218.197 6.56805 217.134 6.3479 215.906 6.3479C214.67 6.3479 213.595 6.56805 212.68 7.00834C211.766 7.44063 211.057 8.06104 210.555 8.86958C210.06 9.67011 209.813 10.6227 209.813 11.7275V11.9316C209.813 13.1404 210.073 14.1571 210.592 14.9817C211.111 15.8062 211.84 16.4306 212.779 16.8549C213.719 17.2712 214.814 17.4793 216.067 17.4793C216.981 17.4713 217.809 17.3632 218.551 17.1551C219.292 16.947 219.927 16.6348 220.454 16.2185C220.99 15.8022 221.397 15.2779 221.678 14.6454L221.702 14.5614H222.815L222.778 14.6694C222.555 15.2779 222.238 15.8142 221.826 16.2785C221.414 16.7428 220.915 17.1311 220.331 17.4433C219.746 17.7555 219.091 17.9917 218.365 18.1518C217.649 18.3119 216.874 18.3919 216.042 18.3919Z"
                                        fill="white"
                                    />
                                </svg>
                            </div>
                        </Col>
                        <Col
                            span={3}
                            offset={15}
                            style={{ display: "flex", justifyContent: "end" }}
                        >
                            <WalletMultiButton />
                        </Col>
                    </Row>
                    <Row>
                        <Col className="tab-box" span={6} offset={9}>
                            <Row>
                                <Col span={12}>
                                    <Button
                                        id="swap-tab-btn"
                                        className="tab-btn"
                                        onClick={() => {
                                            handleNavigationTabChange("swap");
                                        }}
                                    >
                                        Swap
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button
                                        id="liquidity-tab-btn"
                                        className="tab-btn tab-btn-unchecked"
                                        onClick={() => {
                                            handleNavigationTabChange(
                                                "liquidity"
                                            );
                                        }}
                                    >
                                        Liquidity
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </header>

                <aside>
                    <Row>
                        <svg
                            width="34"
                            height="34"
                            viewBox="0 0 34 34"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="Group">
                                <path
                                    id="Path"
                                    d="M4.25 11.3333H29.75"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    id="Path_2"
                                    d="M4.25 18.4167V8.5C4.25 6.15279 6.15279 4.25 8.5 4.25H25.5C27.8472 4.25 29.75 6.15279 29.75 8.5V19.8333C29.75 22.1805 27.8472 24.0833 25.5 24.0833H21.25"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    id="Path_3"
                                    d="M24.083 18.4166H19.833"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    id="Path_4"
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M9.91667 29.7501C9.91667 26.6205 7.37961 24.0834 4.25 24.0834C7.37961 24.0834 9.91667 21.5464 9.91667 18.4167C9.91667 21.5464 12.4537 24.0834 15.5833 24.0834C12.4537 24.0834 9.91667 26.6205 9.91667 29.7501Z"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </g>
                        </svg>
                    </Row>
                    <Row>
                        <p className="aside-title">Faucet</p>
                    </Row>
                    <Row>
                        <span className="aside-desc">
                            Get your test tokens here!
                        </span>
                    </Row>
                    <br />
                    <br />
                    <Row>
                        <Col span={24}>
                            <MintArmIn />
                        </Col>
                    </Row>

                    <br />

                    <Row>
                        <Col span={24}>
                            <MintArmOut />
                        </Col>
                    </Row>
                </aside>

                <main>
                    {tab == NavTab.Swap && <Swap />}
                    {tab == NavTab.Liquidity && <Liquidity />}
                </main>
            </WalletModalProvider>
        </WalletProvider>
    );
};
