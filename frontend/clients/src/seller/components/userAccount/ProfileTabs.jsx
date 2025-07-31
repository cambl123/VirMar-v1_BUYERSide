import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  const tabIndexMap = { posts: 0, about: 1, followers: 2 };
  const tabNameMap = ["posts", "about", "followers"];

  return (
    <Tabs
      index={tabIndexMap[activeTab]}
      onChange={(index) => setActiveTab(tabNameMap[index])}
      variant="soft-rounded"
      colorScheme="blue"
      mb={6}
    >
      <TabList>
        <Tab>Posts</Tab>
        <Tab>About</Tab>
        <Tab>Followers</Tab>
      </TabList>
    </Tabs>
  );
};

export default ProfileTabs;
