import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_STUDENTS } from '../lib/mockData';
import { getRankFromXP, didRankUp, XP_REWARDS } from '../lib/rankSystem';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'studybuddy_current_user_v2';
const STORAGE_KEY_PROFILES = 'studybuddy_profiles_v2';
const STORAGE_KEY_XP_LOGS = 'studybuddy_xp_logs_v2';

export function AuthProvider({ children }) {
  // Initialize profiles store from localStorage or initial seed
  const [allProfiles, setAllProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved profiles:', e);
    }
    return INITIAL_STUDENTS;
  });

  // Current logged in user profile
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Refresh with latest from profiles store if exists
        const matched = INITIAL_STUDENTS.find(p => p.id === parsed.id) || parsed;
        return matched;
      }
    } catch (e) {
      console.warn('Could not read saved current user:', e);
    }
    // Default to the first student (Alex Chen)
    return INITIAL_STUDENTS[0];
  });

  // XP Activity Logs
  const [xpLogs, setXpLogs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_XP_LOGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read xp logs:', e);
    }
    return [
      {
        id: 'log_01',
        action: 'Topic Completed',
        reason: 'Finished Gradient Descent & Backprop Module',
        amount: 150,
        type: 'gain',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'log_02',
        action: 'Daily Streak Bonus',
        reason: 'Day 14 streak maintained!',
        amount: 30,
        type: 'gain',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalMode, setAuthModalMode] = useState(null); // 'login' | 'register' | 'forgot' | null
  const [rankUpData, setRankUpData] = useState(null); // for celebration modal

  // Save changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(allProfiles));
  }, [allProfiles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_XP_LOGS, JSON.stringify(xpLogs));
  }, [xpLogs]);

  // Check Supabase session if configured
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          fetchSupabaseProfile(session.user.id);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (session?.user) {
          fetchSupabaseProfile(session.user.id);
        } else if (!session && isSupabaseConfigured) {
          setCurrentUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSupabaseProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!error && data) {
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Supabase profile fetch error:', err);
    }
  };

  /**
   * Add XP to current user, handle streak and trigger rank-up modal if threshold crossed
   */
  const addXP = (amount, reason = 'Study Activity', action = 'XP Earned') => {
    if (!currentUser || amount <= 0) return;

    const oldXP = currentUser.study_xp || 0;
    const newXP = oldXP + amount;
    const rankUpCheck = didRankUp(oldXP, newXP);

    const updatedUser = {
      ...currentUser,
      study_xp: newXP
    };

    setCurrentUser(updatedUser);
    setAllProfiles(prev => prev.map(p => p.id === currentUser.id ? updatedUser : p));

    // Append log
    const newLog = {
      id: `log_${Date.now()}`,
      action,
      reason,
      amount,
      type: 'gain',
      timestamp: new Date().toISOString()
    };
    setXpLogs(prev => [newLog, ...prev.slice(0, 49)]);

    // Check rank up
    if (rankUpCheck) {
      setRankUpData(rankUpCheck);
    }

    return rankUpCheck;
  };

  /**
   * Deduct XP (when unchecking completed task to prevent cheating)
   */
  const deductXP = (amount, reason = 'Task Unchecked', action = 'XP Deducted') => {
    if (!currentUser || amount <= 0) return;

    const oldXP = currentUser.study_xp || 0;
    const newXP = Math.max(0, oldXP - amount);

    const updatedUser = {
      ...currentUser,
      study_xp: newXP
    };

    setCurrentUser(updatedUser);
    setAllProfiles(prev => prev.map(p => p.id === currentUser.id ? updatedUser : p));

    // Append log
    const newLog = {
      id: `log_${Date.now()}`,
      action,
      reason,
      amount,
      type: 'deduct',
      timestamp: new Date().toISOString()
    };
    setXpLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  /**
   * Mark syllabus topic completed (+150 XP & topic count)
   */
  const incrementTopicsCompleted = (topicName) => {
    if (!currentUser) return;
    const updatedCount = (currentUser.topics_completed || 0) + 1;
    setCurrentUser(prev => ({ ...prev, topics_completed: updatedCount }));
    setAllProfiles(prev => prev.map(p => p.id === currentUser.id ? { ...p, topics_completed: updatedCount } : p));
    addXP(XP_REWARDS.TOPIC_MODULE, `Completed Topic: ${topicName}`, 'Topic Mastery');
  };

  /**
   * Claim daily streak bonus (+30 XP)
   */
  const claimStreakBonus = () => {
    if (!currentUser) return false;
    const today = new Date().toDateString();
    if (currentUser.last_streak_claim === today) {
      return false; // Already claimed today
    }
    const newStreak = (currentUser.study_streak || 0) + 1;
    const updated = {
      ...currentUser,
      study_streak: newStreak,
      last_streak_claim: today
    };
    setCurrentUser(updated);
    setAllProfiles(prev => prev.map(p => p.id === currentUser.id ? updated : p));
    addXP(XP_REWARDS.DAILY_STREAK, `Day ${newStreak} Study Streak bonus claimed!`, 'Streak Bonus');
    return true;
  };

  /**
   * Register a new student account
   * Initialized at starting rank: Bronze I, 0 XP, 1-day streak, 0 topics completed.
   */
  const register = async ({ 
    fullName, 
    email, 
    password, 
    college, 
    branch, 
    year, 
    subjects = [], 
    studyTiming = 'Evening (5PM - 9PM)', 
    learningGoals = ['Exam Prep'] 
  }) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              college,
              branch,
              year,
            }
          }
        });
        if (authError) throw authError;

        const newProfile = {
          id: authData.user?.id || `usr_${Date.now()}`,
          email,
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
          college,
          branch,
          year,
          subjects: subjects.length > 0 ? subjects : ['Data Structures', 'Algorithms'],
          skill_level: 'Beginner',
          learning_goals: learningGoals.length > 0 ? learningGoals : ['Exam Prep'],
          study_timing: studyTiming,
          bio: `Student at ${college} studying ${branch}. Ready to collaborate and climb the ranks!`,
          study_xp: 0, // Starts at Bronze I, 0 XP
          study_streak: 1,
          topics_completed: 0,
          created_at: new Date().toISOString()
        };

        await supabase.from('profiles').insert(newProfile);
        setCurrentUser(newProfile);
        setAllProfiles(prev => [newProfile, ...prev]);
        setAuthModalMode(null);
        return { success: true, user: newProfile };
      }

      // Demo Mode Registration
      const exists = allProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error('An account with this email already exists.');
      }

      const newStudent = {
        id: `usr_${Date.now()}`,
        email,
        full_name: fullName,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
        college,
        branch,
        year,
        subjects: subjects.length > 0 ? subjects : ['Data Structures', 'Algorithms'],
        skill_level: 'Beginner',
        learning_goals: learningGoals.length > 0 ? learningGoals : ['Exam Prep', 'Coursework Mastery'],
        study_timing: studyTiming,
        bio: `Enthusiastic ${year} student at ${college} majoring in ${branch}. Excited to find study partners and level up!`,
        study_xp: 0, // Bronze I, 0 XP
        study_streak: 1,
        topics_completed: 0,
        created_at: new Date().toISOString()
      };

      setAllProfiles(prev => [newStudent, ...prev]);
      setCurrentUser(newStudent);
      setAuthModalMode(null);
      return { success: true, user: newStudent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Login student
   */
  const login = async (email, password) => {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        await fetchSupabaseProfile(data.user.id);
        setAuthModalMode(null);
        return { success: true };
      }

      const student = allProfiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!student) {
        throw new Error('Invalid credentials. No student account found with this email.');
      }

      setCurrentUser(student);
      setAuthModalMode(null);
      return { success: true, user: student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
  };

  /**
   * Update student profile
   */
  const updateProfile = async (updates) => {
    if (!currentUser) return { success: false, error: 'Not authenticated' };

    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', currentUser.id)
          .select()
          .single();
        if (error) throw error;
        setCurrentUser(data);
        setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? data : p)));
        return { success: true, profile: data };
      }

      const updated = {
        ...currentUser,
        ...updates,
        updated_at: new Date().toISOString()
      };

      setCurrentUser(updated);
      setAllProfiles(prev => prev.map(p => (p.id === currentUser.id ? updated : p)));
      return { success: true, profile: updated };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  /**
   * Persona switcher for testing different ranks and views
   */
  const switchPersona = (personaId) => {
    const selected = allProfiles.find(p => p.id === personaId);
    if (selected) {
      setCurrentUser(selected);
    }
  };

  const currentRank = getRankFromXP(currentUser?.study_xp || 0);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRank,
        allProfiles,
        session,
        loading,
        authModalMode,
        setAuthModalMode,
        login,
        register,
        logout,
        updateProfile,
        switchPersona,
        addXP,
        deductXP,
        incrementTopicsCompleted,
        claimStreakBonus,
        xpLogs,
        rankUpData,
        setRankUpData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
