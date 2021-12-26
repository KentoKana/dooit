import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { UserProfileForm } from "../components/Forms/UserSettingsForm/index";
import { AccountSecurityForm } from "../components/Forms/UserSettingsForm/SecurityForm";
import { FormSkeleton } from "../components/Skeletons/FormSkeleton";
import { PageWrapper } from "../components/Layouts/PageWrapper";
import { AiFillLock, AiOutlineUser, AiTwotoneSetting } from "react-icons/ai";
import { useUserSettingsData } from "../hooks/data/useUserSettings";
import { BasePage } from "../components/Layouts/BasePage";
import { IPageProps } from "../utils/SharedInterfaces";

export const UserSettings = observer(({ showSidebar }: IPageProps) => {
  const userSettingsData = useUserSettingsData();
  const { data, refetch } = userSettingsData;

  return (
    <BasePage showSidebar={showSidebar}>
      <PageWrapper
        headingIcon={<AiTwotoneSetting />}
        pageHeading="User Settings"
      >
        <Tabs my="10">
          <TabList>
            <Tab>
              <AiOutlineUser /> Profile
            </Tab>
            <Tab>
              <AiFillLock /> Account Security
            </Tab>
          </TabList>
          <TabPanels maxW="500px">
            <TabPanel>
              {data ? (
                <UserProfileForm
                  data={data}
                  onFormSave={() => {
                    refetch();
                  }}
                />
              ) : (
                <FormSkeleton />
              )}
            </TabPanel>
            <TabPanel>
              <AccountSecurityForm />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </PageWrapper>
    </BasePage>
  );
});
