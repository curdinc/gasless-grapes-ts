import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ReactRouter } from "~app/routes";
import { GlobalStateProvider } from "~app/stateMachines/globalStateContext";
import { theme } from "~app/theme";

function IndexPopup() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter basename="popup.html">
        <GlobalStateProvider>
          <ReactRouter />
        </GlobalStateProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default IndexPopup;
