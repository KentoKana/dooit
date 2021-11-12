import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PrivateRoute } from "./components/PrivateRoute";
import { useEffect, useState } from "react";
import { UseStores } from "./stores/StoreContexts";
import { AppInit } from "./classes/AppInit";
import { NavBar } from "./components/Layouts/NavBar";
import { BasePage } from "./components/Layouts/BasePage";
import { LocalRoutes } from "./enums/LocalRoutes";
import { mainRoutes } from "./routes";
import { auth } from "./firebase";

export const App = observer(() => {
  const { userStore, uiStore } = UseStores();
  const [appInitialized, setAppInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (userStore.isSignedIn) {
      setInterval(() => {
        auth.onAuthStateChanged(async (user) => {
          const retrievedToken = await user?.getIdToken(true);
          if (retrievedToken) {
            localStorage.setItem("user-jwt", retrievedToken);
            userStore.isSignedIn = true;
            console.log("token reset from app component");
          } else {
            localStorage.removeItem("user-jwt");
            userStore.isSignedIn = false;
          }
        });
      }, 600000);
    }

    const app = new AppInit(userStore, uiStore);
    app
      .init((loaded) => setAppInitialized(loaded))
      .catch((error) => {
        return <Redirect to={LocalRoutes.Login} />;
      });
  }, [userStore, uiStore]);

  return (
    <>
      {appInitialized && (
        <Router>
          <NavBar />
          <BasePage>
            <Switch>
              {mainRoutes.map((route) => {
                return route.isPrivate ? (
                  <PrivateRoute
                    key={route.path}
                    exact
                    path={route.path}
                    authenticationPath={
                      route.authenticationPath ?? LocalRoutes.Login
                    }
                    component={route.component}
                  />
                ) : (
                  <Route
                    key={route.path}
                    exact
                    path={route.path}
                    component={route.component}
                  />
                );
              })}
            </Switch>
          </BasePage>
        </Router>
      )}
    </>
  );
});
