import { observer } from "mobx-react-lite";
import { Redirect } from "react-router";
import { UseStores } from "../stores/StoreContexts";

export const Home = observer(() => {
  const { userStore } = UseStores();
  if (userStore.isSignedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <>
      <h1>Home</h1>
    </>
  );
});
