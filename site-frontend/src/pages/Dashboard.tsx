import { observer } from "mobx-react-lite";
import { Jumbotron } from "../components/Dashboard/Jumbotron";
import { BasePage } from "../components/Layouts/BasePage";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { IPageProps } from "../utils/SharedInterfaces";

export const Dashboard = observer(({ showSidebar }: IPageProps) => {
  return (
    <BasePage showSidebar={showSidebar}>
      <PageWrapper>
        <Jumbotron />
      </PageWrapper>
    </BasePage>
  );
});
