import { EventEmitter } from "events";
import type { CreateTRPCProxyClient } from "@trpc/client";
import type { WindowEthereumAppRouter } from "~contents/bridge";

import { type RequestArgument, isEIP1193Error } from "./eip-1193";
// import {
//   PROVIDER_BRIDGE_TARGET,
//   WINDOW_PROVIDER_TARGET,
// } from "../../Background/constants";
import { isObject } from "./runtime-type-checks";
import type { EthersSendCallback, WalletProvider } from "./types";

const METAMASK_STATE_MOCK = {
  accounts: null,
  isConnected: false,
  isUnlocked: false,
  initialized: false,
  isPermanentlyDisconnected: false,
};

export default class AAWindowProvider extends EventEmitter {
  // TODO: This should come from the background with onConnect when any interaction is initiated by the dApp.
  // onboard.js relies on this, or uses a deprecated api. It seemed to be a reasonable workaround for now.
  chainId = "0x5";

  selectedAddress: string | undefined;

  connected = false;

  isAAExtension = true;

  isMetaMask = true;

  isWeb3 = true;

  requestResolvers = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (value: unknown) => void;
      sendData: {
        id: string;
        target: string;
        request: Required<RequestArgument>;
      };
    }
  >();

  _state?: typeof METAMASK_STATE_MOCK;

  providerInfo = {
    label: "Gasless Grapes crypto wallet extension",
    injectedNamespace: "AA-Chrome-Extension",
    identityFlag: "isAAExtension",
    checkIdentity: (provider: WalletProvider) =>
      !!provider && !!provider.isAAExtension,
  } as const;

  constructor(
    public transport: CreateTRPCProxyClient<WindowEthereumAppRouter>,
  ) {
    super();
    this.connected = true;
    this.emit("connect", { chainId: this.chainId });
  }

  private internalBridgeListener = (event: unknown): void => {
    let id: string;
    let result: unknown;

    const requestResolver = this.requestResolvers.get(id);

    if (!requestResolver) return;

    const { sendData, reject, resolve } = requestResolver;

    this.requestResolvers.delete(sendData.id);

    const { method: sentMethod } = sendData.request;

    if (isEIP1193Error(result)) {
      reject(result);
    }

    // let's emit connected on the first successful response from background
    if (!this.connected) {
      this.connected = true;
      this.emit("connect", { chainId: this.chainId });
    }

    switch (sentMethod) {
      case "wallet_switchEthereumChain":
      case "wallet_addEthereumChain":
        // null result indicates successful chain change https://eips.ethereum.org/EIPS/eip-3326#specification
        if (result === null) {
          this.handleChainIdChange(
            (sendData.request.params[0] as { chainId: string }).chainId,
          );
        }
        break;

      case "eth_chainId":
      case "net_version":
        if (
          typeof result === "string" &&
          Number(this.chainId) !== Number(result)
        ) {
          this.handleChainIdChange(result);
        }
        break;

      case "eth_accounts":
      case "eth_requestAccounts":
        if (Array.isArray(result) && result.length !== 0) {
          this.handleAddressChange(result);
        }
        break;

      default:
        break;
    }

    resolve(result);
  };

  isConnected(): boolean {
    return this.connected;
  }

  /**
   * @deprecated
   * use `request({ method: "eth_requestAccounts" });` instead
   * @returns
   */
  async enable(): Promise<unknown> {
    return this.request({ method: "eth_requestAccounts" });
  }

  /**
   * @deprecated
   * deprecated EIP1193 send for web3-react injected provider Send type:
   * https://github.com/NoahZinsmeister/web3-react/blob/d0b038c748a42ec85641a307e6c588546d86afc2/packages/injected-connector/src/types.ts#L4
   * @param method
   * @param params
   */
  send(method: string, params: Array<unknown>): Promise<unknown>;

  /**
   * @deprecated
   * deprecated EIP1193 send for ethers.js Web3Provider > ExternalProvider:
   * https://github.com/ethers-io/ethers.js/blob/73a46efea32c3f9a4833ed77896a216e3d3752a0/packages/providers/src.ts/web3-provider.ts#L19
   * @param method
   * @param params
   */
  send(
    request: RequestArgument,
    callback: (error: unknown, response: unknown) => void,
  ): void;

  send(
    methodOrRequest: string | RequestArgument,
    paramsOrCallback: Array<unknown> | EthersSendCallback,
  ): Promise<unknown> | void {
    if (
      typeof methodOrRequest === "string" &&
      typeof paramsOrCallback !== "function"
    ) {
      return this.request({
        method: methodOrRequest,
        params: paramsOrCallback,
      });
    }

    if (isObject(methodOrRequest) && typeof paramsOrCallback === "function") {
      return this.sendAsync(methodOrRequest, paramsOrCallback);
    }

    return Promise.reject(new Error("Unsupported function parameters"));
  }

  /**
   * @deprecated
   * @param request
   * @param callback
   * @returns
   */
  sendAsync(
    request: RequestArgument & { id?: number; jsonrpc?: string },
    callback: (error: unknown, response: unknown) => void,
  ): Promise<unknown> | void {
    return this.request(request).then(
      (response) =>
        callback(null, {
          result: response,
          id: request.id,
          jsonrpc: request.jsonrpc,
        }),
      (error) => callback(error, null),
    );
  }

  request = (arg: RequestArgument): Promise<unknown> => {
    const { method, params = [] } = arg;
    if (typeof method !== "string") {
      return Promise.reject(new Error(`unsupported method type: ${method}`));
    }

    return this.transport.request.query({
      method,
      params,
    });
  };

  handleChainIdChange(chainId: string): void {
    this.chainId = chainId;
    this.emit("chainChanged", chainId);
    this.emit("networkChanged", Number(chainId).toString());
  }

  handleAddressChange(address: Array<string>): void {
    if (this.selectedAddress !== address[0]) {
      this.selectedAddress = address[0];
      this.emit("accountsChanged", address);
    }
  }
}
