import { z } from "zod";

const EthAddressSchema = z.string().regex(/^0x[0-9,a-f,A-F]{40}$/);
const EthHashSchema = z.string().regex(/^0x[0-9a-f]{64}$/);
const BytesSchema = z.string().regex(/^0x[0-9a-f]*$/);
const BloomFilterSchema = z.string().regex(/^0x[0-9a-f]{512}$/);
const HexNumberSchema = z.string().regex(/^0x([1-9a-f]+[0-9a-f]*|0)$/);
const BlockNonceSchema = z.string().regex(/^0x[0-9a-f]{16}$/);
const BlockTagSchema = z.enum([
  "earliest",
  "finalized",
  "safe",
  "latest",
  "pending",
]);
const BlockNumberSchema = z.union([HexNumberSchema, BlockTagSchema]);

const BlockTransactionSchema = z.object({
  accessList: z.any().array(),
  blockHash: EthHashSchema,
  blockNumber: HexNumberSchema,
  chainId: HexNumberSchema,
  from: EthAddressSchema,
  gas: HexNumberSchema,
  gasPrice: HexNumberSchema,
  hash: EthHashSchema,
  input: BytesSchema,
  maxFeePerGas: HexNumberSchema,
  maxPriorityFeePerGas: HexNumberSchema,
  nonce: HexNumberSchema,
  r: HexNumberSchema,
  s: HexNumberSchema,
  to: EthAddressSchema,
  transactionIndex: z.string(),
  type: z.string().regex(/^0x([0-9,a-f,A-F]?){1,2}$/),
  v: HexNumberSchema,
  value: HexNumberSchema,
});

const RequestedPermissionsSchema = z.record(z.string(), z.object({}));
const nativeCurrencySchema = z.object({
  name: z.string(),
  symbol: z.string(),
  decimals: z.literal(18),
});
const AddEthereumChainParameterSchema = z.object({
  chainId: HexNumberSchema,
  chainName: z.string(),
  nativeCurrency: nativeCurrencySchema,
  rpcUrls: z.string().array().nonempty(),
  blockExplorerUrls: z.string().array().optional(),
  iconUrls: z.string().array().optional(),
});
const SwitchEthereumChainParameterSchema = z.object({
  chainId: HexNumberSchema,
});
const WatchAssetParamsSchema = z.object({
  type: z.literal("ERC20"),
  options: z.object({
    address: EthAddressSchema,
    symbol: z.string(),
    decimals: z.number(),
    image: z.string(),
  }),
});

const BlockInformationSchema = z.object({
  parentHash: EthHashSchema,
  sha3Uncles: EthHashSchema,
  miner: EthAddressSchema,
  stateRoot: EthHashSchema,
  transactionsRoot: EthHashSchema,
  receiptsRoot: EthHashSchema,
  logsBloom: BloomFilterSchema,
  difficulty: BytesSchema,
  baseFeePerGas: HexNumberSchema,
  gasLimit: HexNumberSchema,
  number: HexNumberSchema,
  gasUsed: HexNumberSchema,
  timestamp: HexNumberSchema,
  extraData: BytesSchema,
  hash: EthHashSchema,
  mixHash: EthHashSchema,
  nonce: BlockNonceSchema,
  size: HexNumberSchema,
  totalDifficulty: HexNumberSchema,
  uncles: z.any().array(),
  transactions: z.union([BlockTransactionSchema, EthHashSchema]).array(),
});

export const EvmRequestSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("eth_requestAccounts"),
    param: z.undefined(),
  }),
  z.object({
    method: z.literal("wallet_getPermissions"),
    param: z.undefined(),
  }),
  z.object({
    method: z.literal("wallet_requestPermissions"),
    param: RequestedPermissionsSchema.array().length(1),
  }),
  // Deprecated
  z.object({
    method: z.literal("eth_decrypt"),
    // [0]: An encrypted message.
    // [1]: The address of the Ethereum account that can decrypt the message
    params: z.string().array().length(2),
  }),
  // Deprecated
  z.object({
    method: z.literal(" eth_getEncryptionPublicKey "),
    // [0] The public encryption key of the specified Ethereum account.
    params: z.string().array().length(1),
  }),
  z.object({
    method: z.literal("wallet_addEthereumChain"),
    params: AddEthereumChainParameterSchema.array().length(1),
  }),
  z.object({
    method: z.literal("wallet_switchEthereumChain"),
    params: SwitchEthereumChainParameterSchema.array().length(1),
  }),
  z.object({
    method: z.literal("wallet_watchAsset"),
    params: WatchAssetParamsSchema,
  }),
  // mobile only
  z.object({
    method: z.literal("wallet_scanQRCode"),
    params: z.string().optional().array().length(1),
  }),
  z.object({
    method: z.literal("personal_sign"),
    // [0]: msg
    // [1]: account to sign
    params: z.string().array().length(2),
  }),
  z.object({
    method: z.literal("eth_getBlockByHash"),
    params: z.union([EthHashSchema, z.boolean()]).array().length(2),
  }),
  z.object({
    method: z.literal("eth_getBlockByNumber"),
    params: z
      .union([HexNumberSchema, BlockTagSchema, z.boolean()])
      .array()
      .length(2),
  }),
  z.object({
    method: z.literal("eth_getBlockTransactionCountByHash"),
    params: EthHashSchema.array().length(1),
  }),
  z.object({
    method: z.literal("eth_getBlockTransactionCountByNumber"),
    params: BlockNumberSchema.array().length(1),
  }),
  z.object({
    method: z.literal("eth_getUncleCountByBlockHash"),
    params: EthHashSchema.array().length(1),
  }),
  z.object({
    method: z.literal("eth_getUncleCountByBlockNumber"),
    params: BlockNumberSchema.array().length(1),
  }),
  z.object({
    method: z.literal("eth_chainId"),
    params: z.undefined(),
  }),
  z.object({
    method: z.literal("eth_syncing"),
    params: z.undefined(),
  }),
  z.object({
    method: z.literal("eth_coinbase"),
    params: z.undefined(),
  }),
  z.object({
    method: z.literal("eth_accounts"),
    params: z.undefined(),
  }),
  z.object({
    method: z.literal("eth_blockNumber"),
    params: z.undefined(),
  }),
  z.object({
    method: z.literal("eth_call"),
    // params: z.sarray().length(2),
  }),
]);

const Web3WalletPermissionSchema = z.object({
  parentCapability: z.string(),
  date: z.number().optional(),
});
export const EvmOUtputSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("eth_requestAccounts"),
    result: z.string().array().length(1),
  }),
  z.object({
    method: z.literal("wallet_getPermissions"),
    result: Web3WalletPermissionSchema.array(),
  }),
  z.object({
    method: z.literal("wallet_requestPermissions"),
    result: Web3WalletPermissionSchema.array(),
  }),
  // Deprecated
  z.object({
    method: z.literal("eth_decrypt"),
    result: z.string(),
  }),
  // Deprecated
  z.object({
    method: z.literal(" eth_getEncryptionPublicKey "),
    result: z.string(),
  }),
  z.object({
    method: z.literal("wallet_addEthereumChain"),
    result: z.null(),
  }),
  z.object({
    method: z.literal("wallet_switchEthereumChain"),
    result: z.null(),
  }),
  z.object({
    method: z.literal("wallet_watchAsset"),
    result: z.boolean(),
  }),
  z.object({
    method: z.literal("wallet_scanQRCode"),
    result: z.string(),
  }),
  z.object({
    method: z.literal("personal_sign"),
    result: z.string(),
  }),
  z.object({
    method: z.literal("eth_getBlockByHash"),
    result: BlockInformationSchema,
  }),
  z.object({
    method: z.literal("eth_getBlockByNumber"),
    result: BlockInformationSchema,
  }),
  z.object({
    method: z.literal("eth_getBlockTransactionCountByHash"),
    params: HexNumberSchema,
  }),
  z.object({
    method: z.literal("eth_getBlockTransactionCountByNumber"),
    result: HexNumberSchema,
  }),
  z.object({
    method: z.literal("eth_getUncleCountByBlockHash"),
    result: HexNumberSchema,
  }),
  z.object({
    method: z.literal("eth_getUncleCountByBlockNumber"),
    result: HexNumberSchema,
  }),
  z.object({
    method: z.literal("eth_chainId"),
    result: HexNumberSchema,
  }),
  z.object({
    method: z.literal("eth_syncing"),
    result: z.union([
      z.literal(false),
      z.object({
        startingBlock: HexNumberSchema,
        currentBlock: HexNumberSchema,
        highestBlock: HexNumberSchema,
      }),
    ]),
  }),
  z.object({
    method: z.literal("eth_coinbase"),
    result: EthAddressSchema,
  }),
  z.object({
    method: z.literal("eth_accounts"),
    result: EthAddressSchema.array(),
  }),
  z.object({
    method: z.literal("eth_blockNumber"),
    result: HexNumberSchema,
  }),
]);
export type EvmRequestType = z.infer<typeof EvmRequestSchema>;
