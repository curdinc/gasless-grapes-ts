import { useState } from "react";
import { Button } from "@chakra-ui/react";
import {
  IoCheckmarkCircleSharp,
  IoCloseCircleSharp,
  IoCopyOutline,
} from "react-icons/io5";

import { copyToClipboard, shortenWalletAddress } from "@gg/utils";

export function WalletAddressDisplay({
  walletAddress,
}: {
  walletAddress: string;
}) {
  const [rightIcon, setRightIcon] = useState(<IoCopyOutline />);
  const [isDisabled, setIsDisabled] = useState(false);

  const onCopySuccess = () => {
    setRightIcon(<IoCheckmarkCircleSharp />);
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
      setRightIcon(<IoCopyOutline />);
    }, 2000);
  };
  const onCopyError = () => {
    setRightIcon(<IoCloseCircleSharp />);
    setTimeout(() => {
      setRightIcon(<IoCopyOutline />);
    }, 2000);
  };

  const onClick = () => {
    copyToClipboard({
      valueToCopy: walletAddress,
      onError: onCopyError,
      onSuccess: onCopySuccess,
    }).catch((e) => {
      console.error("Error copying to clipboard", e);
    });
  };
  return (
    <Button
      rightIcon={rightIcon}
      variant="outline"
      isDisabled={isDisabled}
      onClick={onClick}
      w="fit-content"
    >
      {shortenWalletAddress(walletAddress)}
    </Button>
  );
}
