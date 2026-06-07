import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ChatWidget from "../assistant/ChatWidget";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-cream">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
      <ChatWidget />
    </div>
  );
}
