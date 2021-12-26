import { observer } from "mobx-react-lite";
import { Redirect } from "react-router";
import { BasePage } from "../components/Layouts/BasePage";
import { UseStores } from "../stores/StoreContexts";
import { IPageProps } from "../utils/SharedInterfaces";

export const Home = observer(({ showSidebar }: IPageProps) => {
  const { userStore } = UseStores();
  if (userStore.isSignedIn) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <BasePage showSidebar={showSidebar}>
      <h1>Home</h1>
    </BasePage>
  );
});
