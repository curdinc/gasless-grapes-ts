import { useEffect } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

import { BottomNavBar } from "../BottomNavBar";

export const ExtensionLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/onboarding");
  }, [navigate]);
  return (
    <Box w={"395px"} h="600px" mx="auto" rounded="xl">
      <Stack h="100%" spacing={12}>
        <Outlet />
        <BottomNavBar />
      </Stack>
    </Box>
  );
};
