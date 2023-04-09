import { isAddress } from "ethers/lib/utils";
import { z } from "zod";

export const Address = z.custom<string>(isAddress, "Invalid Address");
