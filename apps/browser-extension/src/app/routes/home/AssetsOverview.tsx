import { Heading, Stack } from "@chakra-ui/react";
import { TokensAndNftsGallery } from "~app/components/AssetGallery/TokensAndNftsGallery";
import { WalletAddressDisplay } from "~app/components/WalletAddressDisplay";

export function AssetsOverview() {
  return (
    <>
      <Stack alignItems={"center"} spacing={4} pt={10}>
        <Heading>$0.00</Heading>
        <WalletAddressDisplay walletAddress="0x1234567890" />
      </Stack>
      <TokensAndNftsGallery />
    </>
  );
}
