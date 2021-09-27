import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { AuthService } from "../classes/AuthService";
import { UseStores } from "../stores/StoreContexts";

export const Home = observer(() => {
  const { userStore } = UseStores();
  const authService = new AuthService(userStore);
  return (
    <>
      <h1>Home</h1>
      <button
        onClick={() => {
          authService.signOut();
        }}
      >
        Sign Out
      </button>
      <Button
        onClick={() => {
          fetch("http://localhost:4000/", {
            headers: new Headers({
              "content-type": "application/json",
              Authorization: `Bearer ${userStore?.userToken}`,
            }),
          })
            .then((res) => {
              return res.json();
            })
            .then((data) => {
              console.log(data);
            })
            .catch((err) => {
              console.log(err);
            });
        }}
      >
        Click
      </Button>
    </>
  );
});
