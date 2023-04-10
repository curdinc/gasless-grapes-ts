import type { FlexProps } from "@chakra-ui/layout/dist/flex";
import { AspectRatio, Flex, Heading, Image } from "@chakra-ui/react";
import GrapeIcon from "data-base64:~assets/icon.png";

export function IconAndName(props: FlexProps) {
  return (
    <Flex gap={4} {...props}>
      <AspectRatio ratio={1} w={14}>
        <Image src={GrapeIcon} alt="Gasless Grape" />
      </AspectRatio>
      <Heading fontSize={"3xl"}>Gasless Grapes</Heading>
    </Flex>
  );
}
