import { useContext } from "react";
import { useSelector } from "@xstate/react";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingScreen } from "~app/routes/loading";
import { GlobalStateContext } from "~app/stateMachines/globalStateContext";

export function RouteGuard({
  guardFor,
  children,
}: {
  guardFor: "newUser" | "loggedInUser" | "loggedOutUser";
  children?: React.ReactElement;
}) {
  const { userState: stateService } = useContext(GlobalStateContext);
  const userState = useSelector(stateService, (state) => {
    return {
      isLoggedIn: state.matches("loggedInUser"),
      isLoggedOut: state.matches("loggedOutUser"),
      isNewUser: state.matches("onboardingUser"),
    };
  });

  if (userState.isLoggedIn) {
    if (guardFor === "loggedInUser") {
      return children ? children : <Outlet />;
    }
    return <Navigate to="/" replace={true} />;
  }
  if (userState.isLoggedOut) {
    if (guardFor === "loggedOutUser") {
      return children ? children : <Outlet />;
    }
    return <Navigate to="/login" replace={true} />;
  }
  if (userState.isNewUser) {
    if (guardFor === "newUser") {
      return children ? children : <Outlet />;
    }
    return <Navigate to="/onboarding" replace={true} />;
  }
  return <LoadingScreen />;
}
