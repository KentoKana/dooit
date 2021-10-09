import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { UserProfileForm } from "../components/Forms/UserSettingsForm/index";
import { AccountSecurityForm } from "../components/Forms/UserSettingsForm/SecurityForm";
import { FormSkeleton } from "../components/Skeletons/FormSkeleton";
import { useUserSettingsData } from "../hooks/useUserSettings";
import { PageWrapper } from "./PageWrapper";
import { AiFillLock, AiOutlineUser, AiTwotoneSetting } from "react-icons/ai";

export const UserSettings = observer(() => {
  const userSettingsData = useUserSettingsData();
  const { data, refetch } = userSettingsData;

  return (
    <PageWrapper>
      <Heading
        as="h1"
        fontSize="18px"
        color="grey.700"
        display="flex"
        alignItems="center"
      >
        <AiTwotoneSetting /> User Settings
      </Heading>
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
  );
});
