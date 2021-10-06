import { observer } from "mobx-react-lite";
import { Jumbotron } from "../components/Dashboard/Jumbotron";
import { PageWrapper } from "./PageWrapper";

export const Dashboard = observer(() => {
  return (
    <PageWrapper>
      <Jumbotron />
    </PageWrapper>
  );
});
