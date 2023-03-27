import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";

import { BottomNavBar } from "./BottomNavBar";

export const ExtensionLayout = () => {
  return (
    <BaseExtensionLayout rounded="xl">
      <Stack h="100%" spacing={12}>
        <Outlet />
        <BottomNavBar />
      </Stack>
    </BaseExtensionLayout>
  );
};
