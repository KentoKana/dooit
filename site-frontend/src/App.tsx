import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { useEffect, useState } from "react";
import { UseStores } from "./stores/StoreContexts";
import { AppInit } from "./classes/AppInit";
import { ForgotPassword } from "./pages/ForgotPassword";
import { NavBar } from "./components/Layouts/NavBar";
import { BasePage } from "./components/Layouts/BasePage";
import { Dashboard } from "./pages/Dashboard";
import { LocalRoutes } from "./enums/LocalRoutes";
import { Home } from "./pages/Home";

export const App = observer(() => {
  const { userStore, uiStore } = UseStores();
  const [appInitialized, setAppInitialized] = useState<boolean>(false);

  useEffect(() => {
    const app = new AppInit(userStore, uiStore);
    app.init((loaded) => setAppInitialized(loaded));
  }, [userStore, uiStore]);

  return (
    <>
      {appInitialized && (
        <Router>
          <NavBar />
          <BasePage>
            <Switch>
              <PrivateRoute
                exact
                path={LocalRoutes.Dashboard}
                isAuthenticated={false}
                authenticationPath={LocalRoutes.Login}
                component={Dashboard}
              />
              <Route exact path={LocalRoutes.Home} component={Home} />
              <Route exact path={LocalRoutes.Login} component={Login} />
              <Route exact path={LocalRoutes.SignUp} component={SignUp} />
              <Route
                exact
                path={LocalRoutes.ForgotPassword}
                component={ForgotPassword}
              />
            </Switch>
          </BasePage>
        </Router>
      )}
    </>
  );
});
