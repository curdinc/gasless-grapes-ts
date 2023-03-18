// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  components: {
    Button: {
      // 1. We can update the base styles
      baseStyle: {},
      // 2. We can add a new button size or extend existing
      sizes: {
        xl: {
          h: "56px",
          fontSize: "lg",
          px: "32px",
        },
      },
      // 3. We can add a new visual variant
      variants: {},
      // 6. We can overwrite defaultProps
      defaultProps: {
        rounded: "lg",
      },
    },
  },
});
