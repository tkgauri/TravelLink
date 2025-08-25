import { useState } from "react";
import Navigation from "@/components/navigation";
import Discover from "./discover";
import MyTrips from "./my-trips";
import Messages from "./messages";
import Profile from "./profile";

export default function Home() {
  const [activeTab, setActiveTab] = useState("discover");

  const renderActiveScreen = () => {
    switch (activeTab) {
      case "discover":
        return <Discover />;
      case "trips":
        return <MyTrips />;
      case "messages":
        return <Messages />;
      case "profile":
        return <Profile />;
      default:
        return <Discover />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative">
      {renderActiveScreen()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
