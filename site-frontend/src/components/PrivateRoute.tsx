import { observer } from "mobx-react-lite";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UseStores } from "../stores/StoreContexts";

export type ProtectedRouteProps = {
  authenticationPath: string;
} & RouteProps;

export const PrivateRoute = observer(
  ({ authenticationPath, ...routeProps }: ProtectedRouteProps) => {
    const { userStore } = UseStores();

    if (localStorage.getItem("user-jwt") && userStore.isSignedIn) {
      return <Route {...routeProps} />;
    } else {
      return <Redirect to={{ pathname: authenticationPath }} />;
    }
  }
);
