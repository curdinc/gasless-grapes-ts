import { Flex, Spinner } from "@chakra-ui/react";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";

export function LoadingScreen() {
  return (
    <BaseExtensionLayout
      p={10}
      as={Flex}
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="lg" />
    </BaseExtensionLayout>
  );
}
