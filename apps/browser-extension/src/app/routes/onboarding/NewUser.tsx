import { useContext } from "react";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useSelector } from "@xstate/react";
import { OnboardingStateContext } from "~app/stateMachines/onboardingStateContext";

export function OnboardingNewUser() {
  const { onboardingService } = useContext(OnboardingStateContext);
  const { errors, isSubmitting } = useSelector(onboardingService, (state) => {
    return {
      isSubmitting: !(
        state.matches("onboarding.enteringNewUserDetails") ||
        state.matches("onboarding.errorWithUserInput")
      ),
      errors: state.context.errors,
    };
  });

  return (
    <Stack spacing={6}>
      <form>
        <FormControl isRequired isInvalid={!!errors?.fieldErrors.name}>
          <FormLabel>Account Name</FormLabel>
          <Input
            type="text"
            name="Account Name"
            onChange={(e) => {
              onboardingService.send({
                type: "ENTER_ONBOARDING_DETAILS",
                data: {
                  name: e.target.value,
                },
              });
            }}
          />
          <FormErrorMessage>{errors?.fieldErrors.name?.[0]}</FormErrorMessage>
          <FormHelperText>
            This is for you to identify your account
          </FormHelperText>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors?.fieldErrors.password}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              onboardingService.send({
                type: "ENTER_ONBOARDING_DETAILS",
                data: {
                  password: e.target.value,
                },
              });
            }}
          />
          <FormErrorMessage>
            {errors?.fieldErrors.password?.[0]}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isRequired
          isInvalid={!!errors?.fieldErrors.confirmPassword}
        >
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              onboardingService.send({
                type: "ENTER_ONBOARDING_DETAILS",
                data: {
                  confirmPassword: e.target.value,
                },
              });
            }}
          />
          <FormErrorMessage>
            {errors?.fieldErrors.confirmPassword?.[0]}
          </FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          isLoading={isSubmitting}
          onClick={(e) => {
            e.preventDefault();
            onboardingService.send({
              type: "SUBMIT_INIT_USER",
            });
          }}
        >
          Finish
        </Button>
      </form>
    </Stack>
  );
}
