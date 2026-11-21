import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ConnectionsProvider } from './context/ConnectionsContext';
import { GroupsProvider } from './context/GroupsContext';
import { TasksProvider } from './context/TasksContext';

import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ForgotPasswordModal from './components/auth/ForgotPasswordModal';
import RankUpModal from './components/common/RankUpModal';

import MatchesView from './components/matching/MatchesView';
import ConnectionsView from './components/connections/ConnectionsView';
import GroupsView from './components/groups/GroupsView';
import StudyPlannerView from './components/planner/StudyPlannerView';
import ProfileView from './components/profile/ProfileView';
import LeaderboardView from './components/leaderboard/LeaderboardView';

function MainLayout() {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'connections' | 'groups' | 'planner' | 'leaderboard' | 'profile'
  const { rankUpData, setRankUpData } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {activeTab === 'matches' && <MatchesView />}
        {activeTab === 'connections' && <ConnectionsView />}
        {activeTab === 'groups' && <GroupsView />}
        {activeTab === 'planner' && <StudyPlannerView />}
        {activeTab === 'leaderboard' && <LeaderboardView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Global Modals */}
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
      {rankUpData && (
        <RankUpModal
          rankUpData={rankUpData}
          onClose={() => setRankUpData(null)}
        />
      )}

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ConnectionsProvider>
        <GroupsProvider>
          <TasksProvider>
            <MainLayout />
          </TasksProvider>
        </GroupsProvider>
      </ConnectionsProvider>
    </AuthProvider>
  );
}
