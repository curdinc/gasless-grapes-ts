import { Route, Routes } from "react-router-dom";
import { RouteGuard } from "~app/components/hoc/RouteGuard";

import { AssetsOverview } from "./home/AssetsOverview";
import { ExtensionLayout } from "./home/ExtensionLayout";
import { LoginPage } from "./login";
import { OnboardingExistingUser } from "./onboarding/ExistingUser";
import { OnboardingNewUser } from "./onboarding/NewUser";
import { OnboardingLayout } from "./onboarding/OnboardingLayout";
import { OnboardingWelcome } from "./onboarding/Welcome";

export function ReactRouter() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteGuard guardFor="loggedInUser">
            <ExtensionLayout />
          </RouteGuard>
        }
      >
        <Route path="/" element={<AssetsOverview />} />
      </Route>
      <Route path="/login" element={<RouteGuard guardFor="loggedOutUser" />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route
        path="/onboarding"
        element={
          <RouteGuard guardFor="newUser">
            <OnboardingLayout />
          </RouteGuard>
        }
      >
        <Route path="/onboarding" element={<OnboardingWelcome />} />
        <Route path="/onboarding/new-user" element={<OnboardingNewUser />} />
        <Route
          path="/onboarding/existing-user"
          element={<OnboardingExistingUser />}
        />
      </Route>
    </Routes>
  );
}
