import {
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { UserSettingsForm } from "../components/Forms/UserSettingsForm";
import { PageWrapper } from "./PageWrapper";

export const UserSettings = observer(() => {
  return (
    <PageWrapper>
      <Heading as="h1" fontSize="18px" color="grey.700">
        User Settings
      </Heading>
      <Tabs my="10">
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Account Security</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <UserSettingsForm />
          </TabPanel>
          <TabPanel>Security Form</TabPanel>
        </TabPanels>
      </Tabs>
    </PageWrapper>
  );
});
