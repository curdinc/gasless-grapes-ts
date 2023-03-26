import { useContext } from "react";
import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import GrapeIcon from "data-base64:~assets/icon.png";
import { IoArrowBackSharp } from "react-icons/io5";
import { Outlet, useLocation } from "react-router-dom";
import { BaseExtensionLayout } from "~app/components/BaseExtensionLayout";
import {
  OnboardingStateContext,
  OnboardingStateProvider,
} from "~app/stateMachines/onboardingStateContext";

function OnboardingInnerLayout() {
  const location = useLocation();
  const { onboardingService } = useContext(OnboardingStateContext);

  return (
    <BaseExtensionLayout as={Stack} rounded="xl" p={10}>
      <Flex gap={4} mb={12}>
        <AspectRatio ratio={1} w={14}>
          <Image src={GrapeIcon} alt="Gasless Grape" />
        </AspectRatio>
        <Heading fontSize={"3xl"}>Gasless Grapes</Heading>
      </Flex>

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
