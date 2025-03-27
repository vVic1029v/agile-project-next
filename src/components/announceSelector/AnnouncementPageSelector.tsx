"use client";

import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import AnnouncementsPage from "../AnnouncementsPage";
import NewsFeed from "../NewsFeedPage";
import Panel from "../calendar/calendar-page/Panel";

export default function AnnouncementsPageSelector() {
  const onActiveIndexChange = (index: number) => {
    console.log("Active index changed to:", index);
  };

  return (
    <div className="h-screen w-full bg-cover bg-center bg-[url('/uploads/frontyard.webp')] px-4 z[-2] ">
      <div className="absolute inset-0 bg-black bg-opacity-70 z[-1]"></div>
      <div>
        {" "}
        <ScrollPanels onActiveIndexChange={onActiveIndexChange}>
          <Panel width="w-[80%] h-full">
            <NewsFeed />
          </Panel>
          <Panel width="w-[80%] h-full">
            <AnnouncementsPage />
          </Panel>
        </ScrollPanels>
      </div>
    </div>
  );
}
