import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Home } from "./pages/Home";
import { useEffect, useState } from "react";
import { UseStores } from "./stores/StoreContexts";
import { AppInit } from "./classes/AppInit";
import { ForgotPassword } from "./pages/ForgotPassword";
import { NavBar } from "./components/Layouts/NavBar";

export const App = observer(() => {
  const { userStore } = UseStores();
  const [appInitialized, setAppInitialized] = useState<boolean>(false);

  useEffect(() => {
    const app = new AppInit(userStore);
    app.init();
    setAppInitialized(true);
  }, [userStore]);

  return (
    <>
      {appInitialized && (
        <Router>
          <NavBar />
          <Switch>
            <PrivateRoute
              exact
              path="/"
              isAuthenticated={false}
              authenticationPath={"/login"}
              component={Home}
            />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </Router>
      )}
    </>
  );
});
