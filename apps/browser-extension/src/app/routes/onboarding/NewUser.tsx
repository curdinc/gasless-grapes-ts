import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

export function OnboardingNewUser() {
  return (
    <Stack spacing={6}>
      <FormControl isRequired>
        <FormLabel>Account Name</FormLabel>
        <Input type="text" name="Account Name" />
        <FormHelperText>
          This is for you to identify your account
        </FormHelperText>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <Input type="password" />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <Input type="password" />
      </FormControl>
      <Button>Finish</Button>
    </Stack>
  );
}
