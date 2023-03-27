import { useContext, useEffect, useRef } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";
import { IconAndName } from "~app/components/IconAndName";
import {
  LoginStateContext,
  LoginStateProvider,
} from "~app/stateMachines/loginUserStateMachine";

function InnerLoginPage() {
  const { loginService } = useContext(LoginStateContext);
  const { isError, isLoading } = useSelector(loginService, (state) => {
    return {
      isLoading: state.matches("loggingIn"),
      isError: !!state.context.error,
    };
  });
  const onSubmit = (e) => {
    e.preventDefault();
    loginService.send("LOGIN");
  };
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <BaseExtensionLayout p={10} as={Stack} justifyContent="center">
      <IconAndName mb={10} />
      <form>
        <Stack spacing={5}>
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Password</FormLabel>
            <Input
              ref={inputRef}
              type="password"
              placeholder="password"
              onChange={(e) => {
                loginService.send({
                  type: "ENTER_PASSWORD",
                  data: { password: e.target.value },
                });
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
export function LoginPage() {
  return (
    <LoginStateProvider>
      <InnerLoginPage />
    </LoginStateProvider>
  );
}
