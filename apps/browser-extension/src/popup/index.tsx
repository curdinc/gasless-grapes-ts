import { ChakraProvider } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { router } from "~app/routes";
import { GlobalStateProvider } from "~app/stateMachines/globalStateContext";
import { theme } from "~app/theme";

function IndexPopup() {
  return (
    <GlobalStateProvider>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </GlobalStateProvider>
  );
}

export default IndexPopup;
