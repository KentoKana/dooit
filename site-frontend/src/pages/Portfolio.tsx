import { observer } from "mobx-react-lite";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiOutlineFolderOpen } from "react-icons/ai";
export const Portfolio = observer(() => {
  return (
    <PageWrapper
      pageHeading="My Portfolio"
      headingIcon={<AiOutlineFolderOpen />}
    ></PageWrapper>
  );
});
