import { useContext, useState } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";
import { IconAndName } from "~app/components/IconAndName";
import { GlobalStateContext } from "~app/stateMachines/globalStateContext";

export function LoginPage() {
  const { accountsManager } = useContext(GlobalStateContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    accountsManager.unlockAccount(password).then((userStatus) => {
      if (userStatus !== "loggedInUser") {
        setIsError(true);
        setIsLoading(false);
      } else {
        navigate("/");
      }
    });
  };
  return (
    <BaseExtensionLayout p={10} as={Stack} justifyContent="center">
      <IconAndName mb={10} />
      <form>
        <Stack spacing={5}>
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsError(false);
              }}
            />
            <FormErrorMessage>Invalid Password</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            isLoading={isLoading}
            onClick={onSubmit}
            w="full"
          >
            Unlock Account
          </Button>
        </Stack>
      </form>
    </BaseExtensionLayout>
  );
}
