import { observer } from "mobx-react-lite";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { UseStores } from "../stores/StoreContexts";
import { isNullOrUndefined } from "../utils";

export type ProtectedRouteProps = {
  isAuthenticated: boolean;
  authenticationPath: string;
} & RouteProps;

export const PrivateRoute = observer(
  ({
    isAuthenticated,
    authenticationPath,
    ...routeProps
  }: ProtectedRouteProps) => {
    const { userStore } = UseStores();
    if (!isNullOrUndefined(userStore.userToken)) {
      return <Route {...routeProps} />;
    } else {
      return <Redirect to={{ pathname: authenticationPath }} />;
    }
  }
);
