export function shortenWalletAddress(walletAddress: string) {
  if (walletAddress.startsWith("0x")) {
    return `${walletAddress.slice(0, 6)}...`;
  }
  return `0x${walletAddress.slice(0, 4)}...`;
}
