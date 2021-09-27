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
    </>
  );
});
