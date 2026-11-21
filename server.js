import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Check Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseKey && 
  !supabaseUrl.includes('your-supabase') && 
  !supabaseKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

console.log(`[StudyBuddy API] Supabase Status: ${isSupabaseConfigured ? '🟢 Connected' : '⚡ Local Persistent Demo Mode'}`);

// -------------------------------------------------------------
// In-Memory Data Store (Used for Demo Mode / Offline Fallback)
// -------------------------------------------------------------
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TASKS } from '../client/src/lib/mockData.js';

let profilesStore = [...INITIAL_STUDENTS];
let groupsStore = [...INITIAL_GROUPS];
let tasksStore = [...INITIAL_TASKS];
let xpLogsStore = [
  {
    id: 'log_01',
    user_id: 'usr_alex_01',
    action: 'Topic Completed',
    reason: 'Gradient Descent & Backprop Module',
    amount: 150,
    type: 'gain',
    created_at: new Date(Date.now() - 3600000).toISOString()
  }
];

let connectionsStore = [
  {
    id: 'req_01',
    sender_id: 'usr_sophia_02',
    receiver_id: 'usr_alex_01',
    status: 'pending',
    message: 'Hey Alex! Saw you are studying Advanced Algorithms and Machine Learning. Would love to partner up!',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'req_02',
    sender_id: 'usr_alex_01',
    receiver_id: 'usr_david_05',
    status: 'accepted',
    message: 'Let us practice LeetCode and System Design!',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

// Helper: Compatibility Algorithm (50% Common Subjects, 25% Timing, 25% Learning Goals)
const TIMING_ORDER = ['morning', 'afternoon', 'evening', 'late night'];
const norm = (s) => (s || '').trim().toLowerCase();

function calculateMatchingScore(user, candidate) {
  if (!user || !candidate || user.id === candidate.id) {
    return { score: 0, subjectScore: 0, timingScore: 0, goalScore: 0, commonSubjects: [], commonGoals: [], timingMatchStatus: 'None' };
  }

  // 1. Common Subjects (50%)
  const uSubs = (user.subjects || []).map(norm).filter(Boolean);
  const cSubs = (candidate.subjects || []).map(norm).filter(Boolean);
  let commonSubjects = [];
  let subjectScore = 0;

  if (uSubs.length > 0 && cSubs.length > 0) {
    commonSubjects = (candidate.subjects || []).filter(cs => uSubs.includes(norm(cs)));
    const maxLen = Math.max(uSubs.length, cSubs.length);
    const ratio = commonSubjects.length / (maxLen || 1);
    subjectScore = Math.round(ratio * 50);
  } else if (uSubs.length === 0 && cSubs.length === 0) {
    subjectScore = 20;
  }

  // 2. Study Timing (25%)
  const uTime = norm(user.study_timing || '');
  const cTime = norm(candidate.study_timing || '');
  let timingScore = 0;
  let timingMatchStatus = 'Different';

  if (!uTime || !cTime) {
    timingScore = 12;
    timingMatchStatus = 'Flexible / Unspecified';
  } else if (uTime === cTime) {
    timingScore = 25;
    timingMatchStatus = 'Exact Match';
  } else if (uTime.includes('flexible') || cTime.includes('flexible')) {
    timingScore = 22;
    timingMatchStatus = 'Flexible Timing';
  } else {
    const uIdx = TIMING_ORDER.findIndex(t => uTime.includes(t));
    const cIdx = TIMING_ORDER.findIndex(t => cTime.includes(t));
    if (uIdx !== -1 && cIdx !== -1 && Math.abs(uIdx - cIdx) === 1) {
      timingScore = 15;
      timingMatchStatus = 'Adjacent Slots';
    } else {
      timingScore = 5;
      timingMatchStatus = 'Different Hours';
    }
  }

  // 3. Learning Goals (25%)
  const uGoals = (user.learning_goals || []).map(norm).filter(Boolean);
  const cGoals = (candidate.learning_goals || []).map(norm).filter(Boolean);
  let commonGoals = [];
  let goalScore = 0;

  if (uGoals.length > 0 && cGoals.length > 0) {
    commonGoals = (candidate.learning_goals || []).filter(cg => uGoals.includes(norm(cg)));
    const maxGoals = Math.max(uGoals.length, cGoals.length);
    const ratio = commonGoals.length / (maxGoals || 1);
    goalScore = Math.round(ratio * 25);
  } else if (uGoals.length === 0 && cGoals.length === 0) {
    goalScore = 10;
  }

  const score = Math.min(100, Math.max(0, subjectScore + timingScore + goalScore));

  return {
    score,
    subjectScore,
    timingScore,
    goalScore,
    commonSubjects,
    commonGoals,
    timingMatchStatus
  };
}

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// Health check & environment info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'StudyBuddy API',
    mode: isSupabaseConfigured ? 'supabase' : 'demo',
    timestamp: new Date().toISOString()
  });
});

// Profiles: Get all
app.get('/api/profiles', async (req, res) => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      return res.json(data);
    }
    res.json(profilesStore);
  } catch (err) {
    console.error('Error fetching profiles:', err);
    res.json(profilesStore);
  }
});

// Profiles: Get by ID
app.get('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (!error && data) return res.json(data);
    }
    const found = profilesStore.find(p => p.id === id);
    if (!found) return res.status(404).json({ error: 'Profile not found' });
    res.json(found);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Profiles: Update profile
app.put('/api/profiles/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select().single();
      if (!error && data) return res.json(data);
    }

    const idx = profilesStore.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    profilesStore[idx] = { ...profilesStore[idx], ...updates, updated_at: new Date().toISOString() };
    res.json(profilesStore[idx]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Leaderboard: Global & College Rankings
app.get('/api/leaderboard', async (req, res) => {
  const { college } = req.query;

  try {
    let list = profilesStore;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*').order('study_xp', { ascending: false });
      if (!error && data) list = data;
    }

    if (college && college !== 'all') {
      list = list.filter(p => norm(p.college) === norm(college));
    }

    // Sort descending by Study XP
    const sorted = [...list].sort((a, b) => (b.study_xp || 0) - (a.study_xp || 0));
    res.json({
      count: sorted.length,
      collegeFilter: college || 'all',
      leaderboard: sorted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily Streak Claim Endpoint
app.post('/api/profiles/:id/streak', (req, res) => {
  const { id } = req.params;
  const profile = profilesStore.find(p => p.id === id);
  if (!profile) return res.status(404).json({ error: 'Profile not found' });

  const today = new Date().toDateString();
  if (profile.last_streak_claim === today) {
    return res.status(400).json({ error: 'Streak already claimed for today' });
  }

  profile.study_streak = (profile.study_streak || 0) + 1;
  profile.study_xp = (profile.study_xp || 0) + 30; // +30 XP bonus
  profile.last_streak_claim = today;

  xpLogsStore.unshift({
    id: `log_${Date.now()}`,
    user_id: id,
    action: 'Daily Streak Bonus',
    reason: `Day ${profile.study_streak} study streak claimed!`,
    amount: 30,
    type: 'gain',
    created_at: new Date().toISOString()
  });

  res.json({
    message: 'Streak bonus claimed successfully!',
    study_streak: profile.study_streak,
    study_xp: profile.study_xp
  });
});

// Recommendations / Partner Matching Algorithm Route
app.get('/api/matching/recommendations', async (req, res) => {
  const { userId, subject, timing, year, minScore } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' });
  }

  try {
    let allProfiles = profilesStore;
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('*');
      if (!error && data) allProfiles = data;
    }

    const currentUser = allProfiles.find(p => p.id === userId);
    if (!currentUser) {
      return res.status(404).json({ error: 'Current user profile not found' });
    }

    // Exclude self
    const candidates = allProfiles.filter(p => p.id !== userId);

    let scoredList = candidates.map(candidate => {
      const compatibility = calculateMatchingScore(currentUser, candidate);
      return {
        ...candidate,
        compatibility
      };
    });

    // Apply query filters
    if (subject && subject !== 'all') {
      const subNorm = norm(subject);
      scoredList = scoredList.filter(p => (p.subjects || []).some(s => norm(s).includes(subNorm)));
    }
    if (timing && timing !== 'all') {
      const timeNorm = norm(timing);
      scoredList = scoredList.filter(p => norm(p.study_timing).includes(timeNorm));
    }
    if (year && year !== 'all') {
      scoredList = scoredList.filter(p => p.year === year);
    }
    if (minScore) {
      const min = parseInt(minScore, 10);
      if (!isNaN(min)) scoredList = scoredList.filter(p => p.compatibility.score >= min);
    }

    // Sort strictly descending by compatibility score
    scoredList.sort((a, b) => b.compatibility.score - a.compatibility.score);

    res.json({
      currentUser: {
        id: currentUser.id,
        full_name: currentUser.full_name,
        subjects: currentUser.subjects,
        study_timing: currentUser.study_timing,
        learning_goals: currentUser.learning_goals
      },
      count: scoredList.length,
      recommendations: scoredList
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connections: Get all for current user
app.get('/api/connections', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId query parameter required' });

  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*, sender:profiles!sender_id(*), receiver:profiles!receiver_id(*)')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
      if (!error && data) return res.json(data);
    }

    // Hydrate local demo store
    const userConns = connectionsStore.filter(c => c.sender_id === userId || c.receiver_id === userId);
    const hydrated = userConns.map(c => ({
      ...c,
      sender: profilesStore.find(p => p.id === c.sender_id),
      receiver: profilesStore.find(p => p.id === c.receiver_id)
    }));

    res.json(hydrated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connections: Send Request
app.post('/api/connections/request', async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: 'sender_id and receiver_id are required' });
  }
  if (sender_id === receiver_id) {
    return res.status(400).json({ error: 'Cannot send connection request to yourself' });
  }

  try {
    const existing = connectionsStore.find(c => 
      ((c.sender_id === sender_id && c.receiver_id === receiver_id) ||
       (c.sender_id === receiver_id && c.receiver_id === sender_id)) &&
      (c.status === 'pending' || c.status === 'accepted')
    );

    if (existing) {
      return res.status(400).json({ 
        error: existing.status === 'accepted' ? 'Already connected!' : 'A request is already pending!' 
      });
    }

    const newReq = {
      id: `req_${Date.now()}`,
      sender_id,
      receiver_id,
      status: 'pending',
      message: message || 'Hey! Let us connect and study together.',
      created_at: new Date().toISOString()
    };

    connectionsStore.push(newReq);

    res.status(201).json({
      ...newReq,
      sender: profilesStore.find(p => p.id === sender_id),
      receiver: profilesStore.find(p => p.id === receiver_id)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connections: Accept Request (+20 XP Collaboration reward)
app.put('/api/connections/:id/accept', (req, res) => {
  const { id } = req.params;
  const conn = connectionsStore.find(c => c.id === id);
  if (!conn) return res.status(404).json({ error: 'Connection request not found' });

  conn.status = 'accepted';
  conn.updated_at = new Date().toISOString();

  // Award collaboration XP (+20 XP) to receiver
  const receiver = profilesStore.find(p => p.id === conn.receiver_id);
  if (receiver) {
    receiver.study_xp = (receiver.study_xp || 0) + 20;
  }

  res.json({
    ...conn,
    sender: profilesStore.find(p => p.id === conn.sender_id),
    receiver: profilesStore.find(p => p.id === conn.receiver_id)
  });
});

// Connections: Reject Request
app.put('/api/connections/:id/reject', (req, res) => {
  const { id } = req.params;
  const conn = connectionsStore.find(c => c.id === id);
  if (!conn) return res.status(404).json({ error: 'Connection request not found' });

  conn.status = 'rejected';
  conn.updated_at = new Date().toISOString();

  res.json(conn);
});

// Connections: Cancel / Delete Request
app.delete('/api/connections/:id', (req, res) => {
  const { id } = req.params;
  const idx = connectionsStore.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Connection request not found' });

  const deleted = connectionsStore.splice(idx, 1)[0];
  res.json({ message: 'Request removed successfully', request: deleted });
});

// Groups: Get All
app.get('/api/groups', (req, res) => {
  res.json(groupsStore);
});

// Groups: Create Group (+20 XP for founding)
app.post('/api/groups', (req, res) => {
  const { name, subject, description, visibility, created_by, max_members, schedule, tags } = req.body;
  if (!name || !subject) {
    return res.status(400).json({ error: 'Name and subject are required' });
  }

  const creator = profilesStore.find(p => p.id === created_by);
  if (creator) {
    creator.study_xp = (creator.study_xp || 0) + 20; // +20 XP
  }

  const newGroup = {
    id: `grp_${Date.now()}`,
    name,
    subject,
    description: description || '',
    visibility: visibility || 'public',
    created_by: created_by || 'usr_alex_01',
    creator_name: creator ? creator.full_name : 'Student Organizer',
    max_members: max_members || 50,
    member_count: 1,
    schedule: schedule || 'Weekly Study Session',
    tags: tags || [subject],
    members: [created_by || 'usr_alex_01'],
    created_at: new Date().toISOString()
  };

  groupsStore.unshift(newGroup);
  res.status(201).json(newGroup);
});

// Groups: Join Group (+20 XP for collaboration)
app.post('/api/groups/:id/join', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const group = groupsStore.find(g => g.id === id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  if (!group.members.includes(userId)) {
    group.members.push(userId);
    group.member_count = group.members.length;

    const student = profilesStore.find(p => p.id === userId);
    if (student) {
      student.study_xp = (student.study_xp || 0) + 20; // +20 XP
    }
  }

  res.json(group);
});

// Groups: Leave Group
app.post('/api/groups/:id/leave', (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const group = groupsStore.find(g => g.id === id);
  if (!group) return res.status(404).json({ error: 'Group not found' });

  group.members = group.members.filter(m => m !== userId);
  group.member_count = group.members.length;

  res.json(group);
});

// Tasks: Get All for user
app.get('/api/tasks', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.json(tasksStore);
  const userTasks = tasksStore.filter(t => t.user_id === userId);
  res.json(userTasks);
});

// Tasks: Create Task / Topic
app.post('/api/tasks', (req, res) => {
  const { user_id, title, subject, description, priority, difficulty, is_topic, deadline, estimated_minutes } = req.body;
  if (!title) return res.status(400).json({ error: 'Task title is required' });

  let xp_reward = 50;
  if (is_topic) {
    xp_reward = 150;
  } else if (difficulty === 'Easy') {
    xp_reward = 25;
  } else if (difficulty === 'Hard') {
    xp_reward = 100;
  }

  const newTask = {
    id: `tsk_${Date.now()}`,
    user_id: user_id || 'usr_alex_01',
    title,
    subject: subject || 'General',
    description: description || '',
    priority: priority || 'Medium',
    difficulty: difficulty || 'Medium',
    is_topic: Boolean(is_topic),
    xp_reward,
    deadline: deadline || new Date(Date.now() + 86400000).toISOString(),
    estimated_minutes: estimated_minutes || 60,
    completed: false,
    created_at: new Date().toISOString()
  };

  tasksStore.unshift(newTask);
  res.status(201).json(newTask);
});

// Tasks: Update Task
app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const idx = tasksStore.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });

  tasksStore[idx] = { ...tasksStore[idx], ...req.body, updated_at: new Date().toISOString() };
  res.json(tasksStore[idx]);
});

// Tasks: Toggle completion with XP awarding & anti-cheat deduction
app.patch('/api/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const task = tasksStore.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const nextState = !task.completed;
  task.completed = nextState;
  task.completed_at = nextState ? new Date().toISOString() : null;

  const xpAmount = task.xp_reward || 50;
  const student = profilesStore.find(p => p.id === task.user_id);

  if (student) {
    if (nextState) {
      // Completed: Award XP!
      student.study_xp = (student.study_xp || 0) + xpAmount;
      if (task.is_topic) {
        student.topics_completed = (student.topics_completed || 0) + 1;
      }
      xpLogsStore.unshift({
        id: `log_${Date.now()}`,
        user_id: student.id,
        action: task.is_topic ? 'Topic Mastered' : 'Task Completed',
        reason: task.title,
        amount: xpAmount,
        type: 'gain',
        created_at: new Date().toISOString()
      });
    } else {
      // Reverted: Deduct XP to prevent cheating!
      student.study_xp = Math.max(0, (student.study_xp || 0) - xpAmount);
      xpLogsStore.unshift({
        id: `log_${Date.now()}`,
        user_id: student.id,
        action: 'Task Reverted',
        reason: `Unchecked: ${task.title}`,
        amount: xpAmount,
        type: 'deduct',
        created_at: new Date().toISOString()
      });
    }
  }

  res.json({
    task,
    student_xp: student?.study_xp || 0,
    action: nextState ? 'completed' : 'reverted'
  });
});

// Tasks: Delete Task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const idx = tasksStore.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });

  const deleted = tasksStore.splice(idx, 1)[0];
  res.json({ message: 'Task deleted', task: deleted });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 StudyBuddy Server running on http://localhost:${PORT}`);
});
