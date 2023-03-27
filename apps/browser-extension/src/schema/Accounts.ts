import { z } from "zod";

import { EthAddressSchema } from "./EvmRequestSchema";

export const chainIdSchema = z.union([
  z.literal(1),
  z.literal(5),
  z.literal(80001),
]);

export const PrivateKeyStorageSchema = z.object({
  privateKey: z.string(),
  seedPhrase: z.string().optional(),
});
export type PrivateKeyStorageType = z.infer<typeof PrivateKeyStorageSchema>;
export const RetrievedPrivatekeyStorageSchema = z.union([
  PrivateKeyStorageSchema,
  z.undefined(),
]);
export type RetrievedPrivatekeyStorageType = z.infer<
  typeof RetrievedPrivatekeyStorageSchema
>;

export const AccountSchema = z.object({
  name: z.string(),
  parent: z.string().optional(),
  smartContractWallet: z
    .object({ chain: chainIdSchema, address: EthAddressSchema })
    .optional(),
});
export type AccountType = z.infer<typeof AccountSchema>;

export const AccountsSchema = z.union([AccountSchema.array(), z.undefined()]);
export type AccountsType = z.infer<typeof AccountsSchema>;

export const ActiveAccountSchema = z.object({
  name: z.string().min(1),
});
export type ActiveAccountType = z.infer<typeof ActiveAccountSchema>;

export const ActiveChainSchema = z.object({
  chainId: chainIdSchema,
});
export type ActiveChainType = z.infer<typeof ActiveChainSchema>;
