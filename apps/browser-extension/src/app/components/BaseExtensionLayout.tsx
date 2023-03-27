import type React from "react";
import { Box, BoxProps } from "@chakra-ui/react";

export function BaseExtensionLayout({
  children,
  ...boxProps
}: {
  children: React.ReactNode;
} & BoxProps) {
  return (
    <Box w={"395px"} h="600px" mx="auto" {...boxProps}>
      {children}
    </Box>
  );
}
