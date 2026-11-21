import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_TASKS } from '../lib/mockData';
import { XP_REWARDS } from '../lib/rankSystem';
import confetti from 'canvas-confetti';

const TasksContext = createContext(null);
const STORAGE_KEY_TASKS = 'studybuddy_tasks_v2';

export function TasksProvider({ children }) {
  const { currentUser, addXP, deductXP, incrementTopicsCompleted } = useAuth();

  const [allTasks, setAllTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading tasks:', e);
    }
    return INITIAL_TASKS;
  });

  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed' | 'topics'
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(allTasks));
  }, [allTasks]);

  // Tasks belonging to the logged in user
  const userTasks = allTasks.filter(t => t.user_id === currentUser?.id);

  /**
   * Helper to determine XP reward for task
   */
  const calculateXpReward = (difficulty = 'Medium', isTopic = false) => {
    if (isTopic) return XP_REWARDS.TOPIC_MODULE; // 150
    switch (difficulty) {
      case 'Easy':
        return XP_REWARDS.TASK_EASY; // 25
      case 'Hard':
        return XP_REWARDS.TASK_HARD; // 100
      case 'Medium':
      default:
        return XP_REWARDS.TASK_MEDIUM; // 50
    }
  };

  /**
   * Add a new study task or syllabus topic
   */
  const addTask = ({ 
    title, 
    subject = 'General', 
    description = '', 
    priority = 'Medium', 
    difficulty = 'Medium',
    is_topic = false,
    deadline, 
    estimated_minutes = 60 
  }) => {
    if (!currentUser) return;

    const xp_reward = calculateXpReward(difficulty, is_topic);

    const newTask = {
      id: `tsk_${Date.now()}`,
      user_id: currentUser.id,
      title: title.trim(),
      subject,
      description: description.trim(),
      priority,
      difficulty,
      is_topic: Boolean(is_topic),
      xp_reward,
      deadline: deadline || new Date(Date.now() + 86400000).toISOString(),
      estimated_minutes: parseInt(estimated_minutes, 10) || 60,
      completed: false,
      created_at: new Date().toISOString()
    };

    setAllTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  /**
   * Edit task
   */
  const updateTask = (taskId, updates) => {
    setAllTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const isTopic = updates.is_topic !== undefined ? updates.is_topic : t.is_topic;
          const difficulty = updates.difficulty !== undefined ? updates.difficulty : t.difficulty;
          const xp_reward = calculateXpReward(difficulty, isTopic);

          return { 
            ...t, 
            ...updates, 
            xp_reward,
            updated_at: new Date().toISOString() 
          };
        }
        return t;
      })
    );
  };

  /**
   * Delete task
   */
  const deleteTask = (taskId) => {
    // If completed task is deleted, could optionally deduct or keep. We keep it cleanly removed.
    setAllTasks(prev => prev.filter(t => t.id !== taskId));
  };

  /**
   * Toggle completed status
   * XP Awarding on Completion:
   * - Easy: +25 XP, Medium: +50 XP, Hard: +100 XP, Topic: +150 XP
   * Anti-Cheat Reversion:
   * - Unchecking/reverting a completed task deducts the earned XP!
   */
  const toggleTaskCompleted = (taskId) => {
    setAllTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          const xpAmount = t.xp_reward || calculateXpReward(t.difficulty, t.is_topic);

          if (nextState) {
            // Task marked as COMPLETED -> Award XP!
            if (t.is_topic) {
              incrementTopicsCompleted(t.title);
            } else {
              addXP(xpAmount, `Completed: ${t.title} (${t.difficulty || 'Normal'})`, 'Task Completed');
            }

            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.65 }
              });
            } catch (e) {}
          } else {
            // Task UNCHECKED / REVERTED -> Deduct XP to prevent cheating!
            deductXP(xpAmount, `Unchecked task: ${t.title}`, 'Task Reverted');
          }

          return {
            ...t,
            completed: nextState,
            completed_at: nextState ? new Date().toISOString() : null
          };
        }
        return t;
      })
    );
  };

  // Filtered tasks for current user
  const filteredTasks = userTasks.filter(task => {
    if (filterStatus === 'pending' && task.completed) return false;
    if (filterStatus === 'completed' && !task.completed) return false;
    if (filterStatus === 'topics' && !task.is_topic) return false;
    if (filterSubject !== 'all' && task.subject !== filterSubject) return false;
    return true;
  });

  // Calculate stats
  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const topicsCount = userTasks.filter(t => t.is_topic).length;
  const completedTopics = userTasks.filter(t => t.is_topic && t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const totalXPEarnedFromTasks = userTasks
    .filter(t => t.completed)
    .reduce((sum, t) => sum + (t.xp_reward || 0), 0);

  return (
    <TasksContext.Provider
      value={{
        tasks: userTasks,
        allTasks,
        filteredTasks,
        filterStatus,
        setFilterStatus,
        filterSubject,
        setFilterSubject,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        metrics: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          topicsCount,
          completedTopics,
          completionRate,
          totalXPEarned: totalXPEarnedFromTasks
        }
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TasksProvider');
  return context;
};
