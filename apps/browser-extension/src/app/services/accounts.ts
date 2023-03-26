import { Storage } from "@plasmohq/storage";
import { SecureStorage } from "@plasmohq/storage/secure";

import type { WallerUserState } from "@gg/state-machines";

type AccountType = {
  name: string;
  seedPhrase?: string;
  parent?: string;
  scw?: { chain: string; address: string }[];
};

type AccountsType = AccountType[] | undefined;

export class AccountsManager {
  passwordKey = "password" as const;
  accountsKey = "accounts" as const;
  currentlyActiveAccount = "currentlyActiveAccount" as const;
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
  async init(password) {
    await this.sessionStorage.set(this.passwordKey, password);
    await this.secureStorage.setPassword(password);
  }

  async getEoaPrivateKey(accountName: string) {
    const pwd = await this.sessionStorage.get(this.passwordKey);
    if (!pwd) {
      throw new Error("UNINITIALIZED: make a call to init first");
    }
    return this.secureStorage.get(accountName);
  }
  async setEoaPrivateKey(accountName: string, eoaPrivateKey: string) {
    const pwd = await this.sessionStorage.get(this.passwordKey);
    if (!pwd) {
      throw new Error("UNINITIALIZED: make a call to init first");
    }
    await this.secureStorage.set(accountName, eoaPrivateKey);
  }

  async getUserAccountState(): Promise<WallerUserState> {
    const accounts = await this.syncStorage.get<AccountsType>(this.accountsKey);
    console.log("getting account state. Accounts:", accounts);
    if (accounts) {
      const pwd = await this.sessionStorage.get<string | undefined>(
        this.passwordKey,
      );
      if (pwd) {
        await this.init(pwd);
        return "loggedInUser";
      }
      return "loggedOutUser";
    }
    return "newUser";
  }

  async getCurrentAccount() {}
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

    const accounts = await this.syncStorage.get<AccountsType>(this.accountsKey);
    if (accounts?.length) {
      accounts.push({
        name,
        seedPhrase,
      });
      await this.syncStorage.set(this.accountsKey, accounts);
    } else {
      const newAccounts = [
        {
          name,
          seedPhrase,
        },
      ];
      await this.syncStorage.set(this.accountsKey, newAccounts);
    }
    await this.syncStorage.set(this.currentlyActiveAccount, name);
    await this.setEoaPrivateKey(name, privateKey);
  }
  async lockAccount() {
    await this.sessionStorage.clear();
  }
}
