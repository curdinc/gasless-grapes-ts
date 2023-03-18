import { Flex, IconButton, useToast } from "@chakra-ui/react";
import { IoListSharp, IoPersonSharp, IoWalletSharp } from "react-icons/io5";

export function BottomNavBar() {
  const toast = useToast();

  return (
    <Flex w="100%" justify={"space-between"} bg="blackAlpha.300" px={10} py={3}>
      <IconButton
        variant="ghost"
        aria-label="Wallet View"
        icon={<IoWalletSharp />}
        onClick={() => {
          toast({
            title: `Coming Soon!`,
            variant: "subtle",
            status: "info",
            isClosable: true,
          });
        }}
      />
      <IconButton
        variant="ghost"
        aria-label="Transaction History"
        icon={<IoListSharp size={"25"} />}
        onClick={() => {
          toast({
            title: `Coming Soon!`,
            variant: "subtle",
            status: "info",
            isClosable: true,
          });
        }}
      />
      <IconButton
        variant="ghost"
        aria-label="Profile"
        icon={<IoPersonSharp />}
        onClick={() => {
          toast({
            title: `Coming Soon!`,
            variant: "subtle",
            status: "info",
            isClosable: true,
          });
        }}
      />
    </Flex>
  );
}
