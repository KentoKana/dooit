import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import { AuthService } from "../classes/AuthService";
import { AuthMethod } from "../enums/AuthMethod";
import { LoadingState } from "../enums/LoadingState";
import { UseStores } from "../stores/StoreContexts";

interface ILoginForm {
  email: string;
  password: string;
}
export const Login = observer(() => {
  const { userStore } = UseStores();
  //#region Local States
  const [loginForm, setLoginForm] = useState<ILoginForm>({
    email: "",
    password: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );
  //#endregion
  const history = useHistory();
  const handleLogin = useCallback(
    async (authMethod: AuthMethod) => {
      setLoadingState(LoadingState.Loading);
      const authService = new AuthService(userStore);
      if (authMethod === AuthMethod.EmailAndPassword) {
        return authService
          .loginWithEmailAndPassword(loginForm.email, loginForm.password)
          .then(() => {
            setLoadingState(LoadingState.Loaded);
          })
          .catch((error) => {
            setLoadingState(LoadingState.Error);
            alert(error);
          });
      }
    },
    [userStore, loginForm]
  );

  if (userStore.user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {loadingState === LoadingState.Loading && <>Loggin In...</>}
      {loadingState === LoadingState.Error && <>Error</>}
      {loadingState === LoadingState.None && (
        <>
          <h1>Login</h1>
          <form>
            <div>
              <label htmlFor="email">
                Email:{" "}
                <input
                  name="email"
                  type="email"
                  placeholder="E-mail"
                  onChange={(e) => {
                    e.persist();
                    setLoginForm((prev) => {
                      return {
                        ...prev,
                        email: e.target.value,
                      };
                    });
                  }}
                />
              </label>
            </div>
            <div>
              <label htmlFor="password">
                Password:{" "}
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    e.persist();
                    setLoginForm((prev) => {
                      return {
                        ...prev,
                        password: e.target.value,
                      };
                    });
                  }}
                />
              </label>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogin(AuthMethod.EmailAndPassword)
                  .then(() => {
                    history.push("/");
                  })
                  .catch((error) => {
                    alert(error);
                  });
              }}
            >
              Login
            </button>
          </form>
          <div>
            Don't have an account? Sign up <Link to="/signup">here!</Link>
          </div>
        </>
      )}
    </div>
  );
});
function removeModuleScopePlugin() {
  throw new Error("Function not implemented.");
}
