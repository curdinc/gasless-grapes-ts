import { createBrowserRouter } from "react-router-dom";
import { RouteGuard } from "~app/components/hoc/RouteGuard";

import { AssetsOverview } from "./home/AssetsOverview";
import { ExtensionLayout } from "./home/ExtensionLayout";
import { OnboardingExistingUser } from "./onboarding/ExistingUser";
import { OnboardingNewUser } from "./onboarding/NewUser";
import { OnboardingLayout } from "./onboarding/OnboardingLayout";
import { OnboardingWelcome } from "./onboarding/Welcome";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <RouteGuard guardFor="loggedInUser">
          <ExtensionLayout />
        </RouteGuard>
      ),
      children: [
        {
          path: "/",
          element: <AssetsOverview />,
        },
      ],
    },
    {
      path: "/onboarding",
      element: (
        <RouteGuard guardFor="newUser">
          <OnboardingLayout />
        </RouteGuard>
      ),
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
  ],
  {
    basename: "/popup.html",
  },
);
