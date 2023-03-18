import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import GrapeIcon from "data-base64:~assets/icon128.png";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link, Outlet, useLocation } from "react-router-dom";

export const OnboardingLayout = () => {
  const location = useLocation();

  return (
    <Stack h="100%" spacing={5} w="lg" mx="auto" p={10}>
      <Flex gap={4} mb={12}>
        <AspectRatio ratio={1} w={14}>
          <Image src={GrapeIcon} alt="Gasless Grape" />
        </AspectRatio>
        <Heading>Gasless Grapes</Heading>
      </Flex>

      <Outlet />

      {location.pathname === "/onboarding" ? null : (
        <Button
          variant="ghost"
          as={Link}
          to="/onboarding"
          w="fit-content"
          leftIcon={<IoArrowBackSharp />}
        >
          Back
        </Button>
      )}
    </Stack>
  );
};
