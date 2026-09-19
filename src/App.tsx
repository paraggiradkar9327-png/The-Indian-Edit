import React, { useState } from "react";
import { GameProvider, useGame } from "./context/GameContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// Screens
import { LoginScreen } from "./components/Screens/LoginScreen";
import { OtpScreen } from "./components/Screens/OtpScreen";
import { WelcomeScreen } from "./components/Screens/WelcomeScreen";
import { Level1BottleRush } from "./components/Screens/Level1BottleRush";
import { Level2ZeroMileMap } from "./components/Screens/Level2ZeroMileMap";
import { Level3DecodeTheBottle } from "./components/Screens/Level3DecodeTheBottle";
import { Level4MasterTheBlend } from "./components/Screens/Level4MasterTheBlend";
import { Level5HuntTheEdit } from "./components/Screens/Level5HuntTheEdit";
import { ResultScreen } from "./components/Screens/ResultScreen";
import { SocialPostScreen } from "./components/Screens/SocialPostScreen";
import { UploadScreen } from "./components/Screens/UploadScreen";
import { ScratchCardScreen } from "./components/Screens/ScratchCardScreen";

// Modals
import { SettingsModal } from "./components/Modals/SettingsModal";
import { LeaderboardModal } from "./components/Modals/LeaderboardModal";
import { IntroHeroSplash } from "./components/IntroHeroSplash";

const MainExperience: React.FC = () => {
  const { state } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [showIntroSplash, setShowIntroSplash] = useState(true);

  const renderActiveScreen = () => {
    switch (state.currentScreen) {
      case "screen-login":
        return <LoginScreen />;
      case "screen-otp":
        return <OtpScreen />;
      case "screen-welcome":
        return <WelcomeScreen />;
      case "screen-level-1":
        return <Level1BottleRush />;
      case "screen-level-2":
        return <Level2ZeroMileMap />;
      case "screen-level-3":
        return <Level3DecodeTheBottle />;
      case "screen-level-4":
        return <Level4MasterTheBlend />;
      case "screen-level-5":
        return <Level5HuntTheEdit />;
      case "screen-result":
        return <ResultScreen />;
      case "screen-social":
        return <SocialPostScreen />;
      case "screen-upload":
        return <UploadScreen />;
      case "screen-scratch":
        return <ScratchCardScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#fff3c4]">
      {/* Cinematic Animated Bottle Showcase Intro */}
      {showIntroSplash && (
        <IntroHeroSplash onEnter={() => setShowIntroSplash(false)} />
      )}

      <div>
        <Header
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onShowIntroSplash={() => setShowIntroSplash(true)}
        />
        <main className="w-full">{renderActiveScreen()}</main>
      </div>

      {/* Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <GameProvider>
      <MainExperience />
    </GameProvider>
  );
}

export default App;
