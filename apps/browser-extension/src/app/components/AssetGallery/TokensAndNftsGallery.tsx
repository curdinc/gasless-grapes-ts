import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { NftsGallery } from "./NftsGallery";
import { TokensGallery } from "./TokensGallery";

export function TokensAndNftsGallery() {
  return (
    <Tabs isFitted variant="line" flexGrow={"1"}>
      <TabList mb="1em">
        <Tab>Tokens</Tab>
        <Tab>NFTs</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <TokensGallery />
        </TabPanel>
        <TabPanel>
          <NftsGallery />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
