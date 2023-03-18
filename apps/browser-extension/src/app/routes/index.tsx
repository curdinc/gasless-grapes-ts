import { createBrowserRouter } from "react-router-dom";
import { ExtensionLayout } from "~app/components/layout/ExtensionLayout";
import { OnboardingLayout } from "~app/components/layout/OnboardingLayout";

import { AssetsOverview } from "./home/AssetsOverview";
import { OnboardingExistingUser } from "./onboarding/ExistingUser";
import { OnboardingNewUser } from "./onboarding/NewUser";
import { OnboardingWelcome } from "./onboarding/Welcome";

export const router = createBrowserRouter([
  {
    path: "/popup.html",
    element: <ExtensionLayout />,
    children: [
      {
        path: "/popup.html",
        element: <AssetsOverview />,
      },
    ],
  },
  {
    path: "/onboarding",
    element: <OnboardingLayout />,
    children: [
      {
        path: "/onboarding",
        element: <OnboardingWelcome />,
      },
      {
        path: "/onboarding/new-user",
        element: <OnboardingNewUser />,
      },
      {
        path: "/onboarding/existing-user",
        element: <OnboardingExistingUser />,
      },
    ],
  },
]);
