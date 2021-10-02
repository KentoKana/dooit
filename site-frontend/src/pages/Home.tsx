import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { AuthService } from "../classes/AuthService";
import { useResetQuery } from "../hooks/useResetQuery";
import { UseStores } from "../stores/StoreContexts";

export const Home = observer(() => {
  const { userStore, uiStore } = UseStores();
  const authService = new AuthService(userStore, uiStore);
  const reset = useResetQuery();

  return (
    <>
      <h1>Home</h1>
      <button
        onClick={() => {
          authService.signOut();
          reset();
        }}
      >
        Sign Out
      </button>
      <Button
        variant="primary"
        onClick={() => {
          // console.log(data);
        }}
      >
        Click
      </Button>
    </>
  );
});
