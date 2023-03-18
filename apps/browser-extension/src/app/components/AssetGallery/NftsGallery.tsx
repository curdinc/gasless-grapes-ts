import { Button, Stack, Text, useToast } from "@chakra-ui/react";

export function NftsGallery() {
  const toast = useToast();

  return (
    <Stack alignItems={"center"}>
      <Text>Don&apos;t see your NFTs?</Text>
      <Button
        variant={"ghost"}
        onClick={() => {
          toast({
            title: `Coming Soon!`,
            variant: "subtle",
            status: "info",
            isClosable: true,
          });
        }}
      >
        Add NFTs
      </Button>
    </Stack>
  );
}
