import { Storage } from "@plasmohq/storage";
import { SecureStorage } from "@plasmohq/storage/secure";
import { polygonMumbai } from "@wagmi/chains";
import {
  AccountsSchema,
  type AccountsType,
  ActiveAccountType,
  ActiveChainType,
  PrivateKeyStorageType,
  RetrievedPrivatekeyStorageType,
} from "~schema/Accounts";

import type { UserWalletState } from "@gg/state-machines";

export class AccountsManager {
  eoaPrivateKeyPrefix = "gg_eoa_pkey_" as const;
  passwordKey = "password" as const;
  accountsKey = "accounts" as const;
  currentlyActiveAccount = "currentlyActiveAccount" as const;
  currentlyActiveChain = "currentlyActiveChain" as const;
  syncStorage: Storage;
  sessionStorage: Storage;
  secureStorage: SecureStorage;
  constructor() {
    this.sessionStorage = new Storage({
      area: "session",
    });
    this.syncStorage = new Storage({
      area: "sync",
    });
    this.secureStorage = new SecureStorage({
      area: "sync",
    });
  }
  async getPassword() {
    return this.sessionStorage.get(this.passwordKey);
  }

  async init(password) {
    await this.sessionStorage.set(this.passwordKey, password);
  }

  async isInit() {
    return typeof (await this.getPassword()) === "string";
  }

  async uninit() {
    await this.sessionStorage.clear();
    await this.secureStorage.setPassword("");
  }

  async getEoaPrivateKey(accountName: string) {
    // todo: test this when we get it without first setting pwd, with wrong pwd (returns undefined) etc.
    if (!(await this.isInit())) {
      throw new Error("UNINITIALIZED: make a call to init first");
    }
    const password = await this.getPassword();
    await this.secureStorage.setPassword(password);
    const sensitiveItems =
      await this.secureStorage.get<RetrievedPrivatekeyStorageType>(accountName);
    if (sensitiveItems?.privateKey.startsWith(this.eoaPrivateKeyPrefix)) {
      return sensitiveItems.privateKey.split(this.eoaPrivateKeyPrefix)[1];
    }
    throw new Error("INVALID PASSWORD");
  }
  async setEoaPrivateKey(
    accountName: string,
    sensitiveItems: PrivateKeyStorageType,
  ) {
    if (!(await this.isInit())) {
      throw new Error("UNINITIALIZED: make a call to init first");
    }
    const password = await this.getPassword();
    await this.secureStorage.setPassword(password);
    await this.secureStorage.set(accountName, {
      privateKey: `${this.eoaPrivateKeyPrefix}${sensitiveItems.privateKey}`,
      seedPhrase: sensitiveItems.seedPhrase,
    } as PrivateKeyStorageType);
  }

  async getUserAccountState(): Promise<UserWalletState> {
    const accounts = AccountsSchema.parse(
      await this.syncStorage.get<AccountsType>(this.accountsKey),
    );
    console.log("getting account state. Accounts:", accounts);
    if (accounts) {
      try {
        const activeAccount = await this.getActiveAccount();
        await this.getEoaPrivateKey(activeAccount.name);
        return "loggedInUser";
      } catch (e) {
        console.error(e);
        return "loggedOutUser";
      }
    }
    return "newUser";
  }

  async getActiveAccount() {
    return this.syncStorage.get<ActiveAccountType>(this.currentlyActiveAccount);
  }
  async setActiveAccount(activeAccount: ActiveAccountType) {
    // TODO: make sure active account is in list of accounts
    await this.syncStorage.set(this.currentlyActiveAccount, activeAccount);
  }

  async getActiveChain() {
    return this.syncStorage.get<ActiveChainType>(this.currentlyActiveChain);
  }
  async setActiveChain(chain: ActiveChainType) {
    return this.syncStorage.set(this.currentlyActiveChain, chain);
  }

  async getAccounts() {
    return this.syncStorage.get<AccountsType>(this.accountsKey);
  }
  async setAccounts(accounts: AccountsType) {
    return this.syncStorage.set(this.accountsKey, accounts);
  }
  async createAccount({
    seedPhrase,
    name,
    pwd,
    privateKey,
  }: {
    pwd: string;
    name: string;
    privateKey: string;
    seedPhrase?: string;
  }) {
    await this.init(pwd);

    const accounts = await this.getAccounts();
    if (accounts?.length) {
      accounts.push({
        name,
      });
      await this.setAccounts(accounts);
    } else {
      const newAccounts = [
        {
          name,
        },
      ];
      await this.setAccounts(newAccounts);
    }
    await this.setActiveAccount({ name });
    await this.setActiveChain({
      chainId: polygonMumbai.id,
    });
    console.log("name", name);
    await this.setEoaPrivateKey(name, {
      privateKey,
      seedPhrase,
    });
  }
  async lockAccount() {
    return await this.uninit();
  }

  async unlockAccount(password: string) {
    await this.init(password);
    return this.getUserAccountState();
  }
}
