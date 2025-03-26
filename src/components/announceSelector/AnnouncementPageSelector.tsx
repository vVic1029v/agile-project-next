"use client"

import ScrollPanels from "@/components/calendar/calendar-page/ScrollPanels";
import AnnouncementsPage from "../AnnouncementsPage";
import NewsFeed from "../NewsFeedPage";
import Panel from "../calendar/calendar-page/Panel";

export default function AnnouncementsPageSelector(){
    const onActiveIndexChange = (index: number) => {
        console.log("Active index changed to:", index);
    };

    return (
        <ScrollPanels onActiveIndexChange={onActiveIndexChange} >
             <Panel width="w-[80%]">
                <NewsFeed />
            </Panel>
            <Panel width="w-[80%]">
                <AnnouncementsPage />
            </Panel>
            
           
        </ScrollPanels>
    );
}