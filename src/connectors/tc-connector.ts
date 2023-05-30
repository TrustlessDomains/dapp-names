import { TC_WALLET_CONNECT_URL, TC_WEB_WALLET_URL } from "@/configs";
import * as TC_CONNECT from "tc-connect";

const connector = new TC_CONNECT.DappConnect(TC_WALLET_CONNECT_URL, TC_WEB_WALLET_URL);
export default connector;
