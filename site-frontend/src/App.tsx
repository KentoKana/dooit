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
import { LocalRoutes } from "./enums/LocalRoutes";
import { mainRoutes } from "./routes";
import { Box, Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

export const App = observer(() => {
  const { userStore, uiStore } = UseStores();
  const [appInitialized, setAppInitialized] = useState<boolean>(false);
  useEffect(() => {
    const app = new AppInit(userStore, uiStore);
    app
      .init((loaded) => {
        setAppInitialized(true);
      })
      .then(() => {
        setAppInitialized(true);
      })
      .catch((error) => {
        return <Redirect to={LocalRoutes.Login} />;
      });
  }, [userStore, uiStore]);

  return (
    <>
      {appInitialized ? (
        <Router>
          <NavBar />
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
                  render={() => {
                    return route.component;
                  }}
                />
              ) : (
                <Route
                  key={route.path}
                  exact
                  path={route.path}
                  render={() => {
                    return route.component;
                  }}
                />
              );
            })}
          </Switch>
        </Router>
      ) : (
        <Flex
          h="100vh"
          w="100vw"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Box>
            <Spinner />
          </Box>
          <Box>Hold on tight! We're initializing ForkIt :P</Box>
        </Flex>
      )}
    </>
  );
});
