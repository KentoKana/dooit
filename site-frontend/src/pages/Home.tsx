import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { AuthService } from "../classes/AuthService";
import { useDashboard } from "../hooks/useDashboard";
import { useResetQuery } from "../hooks/useResetQuery";
import { UseStores } from "../stores/StoreContexts";

export const Home = observer(() => {
  const { userStore } = UseStores();
  const authService = new AuthService(userStore);
  const reset = useResetQuery();
  const { data, error } = useDashboard();

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
          console.log(data);
          console.log(error);
        }}
      >
        Click
      </Button>
    </>
  );
});
