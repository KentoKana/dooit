import { observer } from "mobx-react-lite";
import { useCallback, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { UseStores } from "../stores/StoreContexts";
import { AuthService } from "../classes/AuthService";
import { LoadingState } from "../enums/LoadingState";
import { isNullOrUndefined } from "../utils";

interface ISignUpForm {
  email: string;
  password: string;
}
export const SignUp = observer(() => {
  const { uiStore, userStore } = UseStores();
  //#region Local States
  const [signupForm, setSignupForm] = useState<ISignUpForm>({
    email: "",
    password: "",
  });
  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.None
  );

  //#endregion
  const history = useHistory();
  const handleSignUp = useCallback(async () => {
    setLoadingState(LoadingState.Loading);
    const authService = new AuthService(userStore);
    authService
      .createUserWithEmailAndPassword(signupForm.email, signupForm.password)
      .then((userCred) => {
        userCred.user
          .getIdToken()
          .then(async (token) => {
            localStorage.setItem("user-jwt", token);
            userStore.userToken = token;
            return token;
          })
          .then((token) => {
            userStore.userToken = token;
            uiStore
              .apiRequest<{ id: string }>("http://localhost:4000/usder", {
                method: "POST",
                bodyData: { id: token },
              })
              .then((d) => {
                console.log(d);
                setLoadingState(LoadingState.Loaded);
                history.push("/");
              })
              .catch(() => {
                setLoadingState(LoadingState.Error);
                // Delete user from Firebase if API fails
                userCred.user.delete();
              });
          });
      })
      .catch((error) => {
        setLoadingState(LoadingState.Error);
        alert(error);
      });
  }, [uiStore, userStore, history, signupForm]);

  if (!isNullOrUndefined(userStore.userToken)) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      {loadingState === LoadingState.Loading && <>Loading</>}
      {loadingState === LoadingState.Error && <>Error</>}
      {loadingState === LoadingState.None && (
        <>
          <h1>Sign Up</h1>
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
                    setSignupForm((prev) => {
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
                    setSignupForm((prev) => {
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
                handleSignUp();
              }}
            >
              Sign Up
            </button>
          </form>
        </>
      )}
    </div>
  );
});
