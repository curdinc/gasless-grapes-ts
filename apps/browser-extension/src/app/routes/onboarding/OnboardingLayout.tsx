import { useContext } from "react";
import { Button, Stack } from "@chakra-ui/react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Outlet, useLocation } from "react-router-dom";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";
import { IconAndName } from "~app/components/IconAndName";
import {
  OnboardingStateContext,
  OnboardingStateProvider,
} from "~app/stateMachines/onboardingStateContext";

function OnboardingInnerLayout() {
  const location = useLocation();
  const { onboardingService } = useContext(OnboardingStateContext);

  return (
    <BaseExtensionLayout as={Stack} rounded="xl" p={8}>
      <IconAndName mb={12} />

      <Outlet />

      {location.pathname === "/onboarding" ? null : (
        <Button
          variant="link"
          onClick={() => {
            onboardingService.send("BACK_TO_WELCOME_SCREEN");
          }}
          w="fit-content"
          display={"block"}
          py={6}
          leftIcon={<IoArrowBackSharp />}
        >
          Back
        </Button>
      )}
    </BaseExtensionLayout>
  );
}

export function OnboardingLayout() {
  return (
    <OnboardingStateProvider>
      <OnboardingInnerLayout />
    </OnboardingStateProvider>
  );
}
