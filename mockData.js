/**
 * Initial seed data for StudyBuddy demo store
 * Realistic student profiles across top universities, branches, and subject domains.
 * Includes Free Fire style rank progression: XP, streak, topics completed.
 */

export const INITIAL_STUDENTS = [
  {
    id: 'usr_alex_01',
    email: 'alex.chen@stanford.edu',
    full_name: 'Alex Chen',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    branch: 'Computer Science',
    year: '3rd Year',
    subjects: ['Data Structures', 'Algorithms', 'Machine Learning', 'Computer Networks'],
    skill_level: 'Advanced',
    learning_goals: ['Exam Prep', 'Competitive Programming', 'Side Projects'],
    study_timing: 'Evening (5PM - 9PM)',
    bio: 'Junior CS student passionate about distributed systems and competitive programming. Looking for a dedicated peer to grind LeetCode Medium/Hard patterns and review Operating Systems lectures.',
    study_xp: 2480, // Diamond II
    study_streak: 14,
    topics_completed: 18,
    created_at: '2026-09-01T10:00:00Z'
  },
  {
    id: 'usr_sophia_02',
    email: 'sophia.patel@berkeley.edu',
    full_name: 'Sophia Patel',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    college: 'UC Berkeley',
    branch: 'Data Science & AI',
    year: '3rd Year',
    subjects: ['Machine Learning', 'Data Structures', 'Linear Algebra', 'Probability & Statistics'],
    skill_level: 'Intermediate',
    learning_goals: ['Exam Prep', 'Side Projects', 'Research Paper Reading'],
    study_timing: 'Evening (5PM - 9PM)',
    bio: 'Exploring neural architectures, LLM fine-tuning, and statistical modeling. Big fan of 50/10 Pomodoro sprints and whiteboarding math proofs.',
    study_xp: 3650, // Heroic
    study_streak: 22,
    topics_completed: 28,
    created_at: '2026-09-03T11:30:00Z'
  },
  {
    id: 'usr_david_05',
    email: 'david.kim@stanford.edu',
    full_name: 'David Kim',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    college: 'Stanford University',
    branch: 'Computer Science',
    year: '4th Year',
    subjects: ['Data Structures', 'Operating Systems', 'System Design', 'Web Development'],
    skill_level: 'Advanced',
    learning_goals: ['Competitive Programming', 'Side Projects', 'Interview Prep'],
    study_timing: 'Late Night (9PM - 1AM)',
    bio: 'Senior undergrad preparing for tech company mock interviews. Always up for system design debates, Redis caching discussions, and late-night coding sessions.',
    study_xp: 4850, // Grandmaster (Top elite tier)
    study_streak: 35,
    topics_completed: 42,
    created_at: '2026-09-10T22:00:00Z'
  },
  {
    id: 'usr_riya_08',
    email: 'riya.sen@cmu.edu',
    full_name: 'Riya Sen',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    college: 'Carnegie Mellon University',
    branch: 'Artificial Intelligence',
    year: '4th Year',
    subjects: ['Machine Learning', 'Computer Vision', 'Deep Learning', 'Data Structures'],
    skill_level: 'Advanced',
    learning_goals: ['Research Paper Reading', 'Side Projects', 'Exam Prep'],
    study_timing: 'Evening (5PM - 9PM)',
    bio: 'Working on visual representation models and diffusion algorithms. Let’s co-work quietly or bounce project ideas over Discord.',
    study_xp: 3920, // Heroic
    study_streak: 19,
    topics_completed: 31,
    created_at: '2026-09-18T19:10:00Z'
  },
  {
    id: 'usr_elena_04',
    email: 'elena.gomez@gatech.edu',
    full_name: 'Elena Gomez',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    college: 'Georgia Tech',
    branch: 'Physics & Engineering',
    year: '2nd Year',
    subjects: ['Classical Mechanics', 'Electromagnetism', 'Calculus III', 'Thermodynamics'],
    skill_level: 'Intermediate',
    learning_goals: ['Exam Prep', 'Coursework Mastery', 'Lab Assignments'],
    study_timing: 'Afternoon (12PM - 4PM)',
    bio: 'Hands-on learner who loves connecting theoretical physics equations to real engineering scenarios. Seeking partners to tackle homework sets together.',
    study_xp: 1620, // Platinum II
    study_streak: 11,
    topics_completed: 15,
    created_at: '2026-09-08T14:20:00Z'
  },
  {
    id: 'usr_marcus_03',
    email: 'marcus.vance@mit.edu',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    college: 'MIT',
    branch: 'Mathematics',
    year: '2nd Year',
    subjects: ['Calculus III', 'Linear Algebra', 'Discrete Mathematics', 'Probability & Statistics'],
    skill_level: 'Advanced',
    learning_goals: ['Exam Prep', 'Coursework Mastery'],
    study_timing: 'Morning (6AM - 10AM)',
    bio: 'Pure math enthusiast. I enjoy dissecting complex analysis proofs and vector calculus. Early riser with an espresso who loves discussing problem sets.',
    study_xp: 1080, // Gold III
    study_streak: 9,
    topics_completed: 12,
    created_at: '2026-09-05T08:15:00Z'
  },
  {
    id: 'usr_ananya_06',
    email: 'ananya.sharma@umich.edu',
    full_name: 'Ananya Sharma',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    college: 'University of Michigan',
    branch: 'Electrical Engineering',
    year: '3rd Year',
    subjects: ['Digital Logic Design', 'Signals & Systems', 'Microprocessors', 'Calculus III'],
    skill_level: 'Intermediate',
    learning_goals: ['Exam Prep', 'Coursework Mastery'],
    study_timing: 'Evening (5PM - 9PM)',
    bio: 'Passionate about FPGA programming and analog circuitry. Looking for fellow engineers to quiz each other before midterms and finals.',
    study_xp: 1380, // Platinum I
    study_streak: 8,
    topics_completed: 14,
    created_at: '2026-09-12T17:45:00Z'
  },
  {
    id: 'usr_aisha_09',
    email: 'aisha.khan@mit.edu',
    full_name: 'Aisha Khan',
    avatar_url: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=200&auto=format&fit=crop&q=80',
    college: 'MIT',
    branch: 'Computer Science',
    year: '3rd Year',
    subjects: ['Algorithms', 'Data Structures', 'Operating Systems', 'System Design'],
    skill_level: 'Advanced',
    learning_goals: ['Competitive Programming', 'Side Projects', 'Exam Prep'],
    study_timing: 'Evening (5PM - 9PM)',
    bio: 'ACM ICPC regionalist and backend systems builder. Always up for whiteboarding graph algorithms.',
    study_xp: 3110, // Diamond IV
    study_streak: 17,
    topics_completed: 25,
    created_at: '2026-09-20T14:00:00Z'
  },
  {
    id: 'usr_liam_10',
    email: 'liam.oconnor@uiuc.edu',
    full_name: "Liam O'Connor",
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    college: 'UIUC',
    branch: 'Computer Science',
    year: '2nd Year',
    subjects: ['Computer Networks', 'Data Structures', 'Web Development'],
    skill_level: 'Intermediate',
    learning_goals: ['Side Projects', 'Coursework Mastery'],
    study_timing: 'Afternoon (12PM - 4PM)',
    bio: 'Web engineer and distributed systems fan. Building full-stack projects in React, Node and Go.',
    study_xp: 780, // Gold I
    study_streak: 6,
    topics_completed: 7,
    created_at: '2026-09-22T16:30:00Z'
  },
  {
    id: 'usr_priya_11',
    email: 'priya.nair@cornell.edu',
    full_name: 'Priya Nair',
    avatar_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    college: 'Cornell University',
    branch: 'Information Science',
    year: '2nd Year',
    subjects: ['Data Structures', 'Web Development', 'Probability & Statistics'],
    skill_level: 'Intermediate',
    learning_goals: ['Coursework Mastery', 'Exam Prep'],
    study_timing: 'Morning (6AM - 10AM)',
    bio: 'Curious student diving into human-computer interaction and data visualization. Early bird study partner.',
    study_xp: 620, // Silver III
    study_streak: 5,
    topics_completed: 6,
    created_at: '2026-09-25T09:00:00Z'
  },
  {
    id: 'usr_jordan_07',
    email: 'jordan.taylor@utexas.edu',
    full_name: 'Jordan Taylor',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    college: 'UT Austin',
    branch: 'Computer Science',
    year: '1st Year',
    subjects: ['Intro to Programming', 'Discrete Mathematics', 'Calculus I', 'Web Development'],
    skill_level: 'Beginner',
    learning_goals: ['Coursework Mastery', 'Side Projects', 'Exam Prep'],
    study_timing: 'Flexible',
    bio: 'Freshman coder excited to build interactive web apps with React. Enthusiastic, friendly, and always eager to learn from peers.',
    study_xp: 140, // Bronze II
    study_streak: 3,
    topics_completed: 2,
    created_at: '2026-09-15T13:00:00Z'
  }
];

export const INITIAL_GROUPS = [
  {
    id: 'grp_01',
    name: 'Programming Pals',
    subject: 'Computer Science',
    description: 'Weekly collaborative programming sessions focusing on algorithm visualization, code reviews, and debugging complex homework assignments.',
    visibility: 'public',
    created_by: 'usr_alex_01',
    creator_name: 'Alex Chen',
    max_members: 50,
    member_count: 28,
    schedule: 'Mondays & Thursdays, 7:00 PM EST',
    tags: ['Algorithms', 'Python', 'C++', 'LeetCode'],
    members: ['usr_alex_01', 'usr_sophia_02', 'usr_david_05', 'usr_jordan_07', 'usr_aisha_09']
  },
  {
    id: 'grp_02',
    name: 'Mathematics Circle',
    subject: 'Mathematics',
    description: 'A study forum dedicated to mastering proof techniques, Linear Algebra transformations, and Multivariable Calculus problem sets.',
    visibility: 'public',
    created_by: 'usr_marcus_03',
    creator_name: 'Marcus Vance',
    max_members: 30,
    member_count: 19,
    schedule: 'Tuesdays & Fridays, 10:00 AM EST',
    tags: ['Calculus III', 'Linear Algebra', 'Discrete Math'],
    members: ['usr_marcus_03', 'usr_elena_04', 'usr_ananya_06']
  },
  {
    id: 'grp_03',
    name: 'Physics Forum',
    subject: 'Physics',
    description: 'Deep dive into theoretical and applied physics. We dissect mechanics, electromagnetism formulas, thermodynamics, and lab experiments.',
    visibility: 'public',
    created_by: 'usr_elena_04',
    creator_name: 'Elena Gomez',
    max_members: 25,
    member_count: 14,
    schedule: 'Wednesdays & Saturdays, 4:00 PM EST',
    tags: ['Mechanics', 'Electromagnetism', 'Lab Prep'],
    members: ['usr_elena_04', 'usr_ananya_06', 'usr_marcus_03']
  },
  {
    id: 'grp_04',
    name: 'Data Structures Club',
    subject: 'Data Structures',
    description: 'High-intensity practice group tackling tree traversals, dynamic programming, graphs, and Big-O efficiency analysis for interviews and midterms.',
    visibility: 'public',
    created_by: 'usr_david_05',
    creator_name: 'David Kim',
    max_members: 60,
    member_count: 42,
    schedule: 'Daily, 8:30 PM EST',
    tags: ['Binary Trees', 'Graphs', 'DP', 'System Design'],
    members: ['usr_david_05', 'usr_alex_01', 'usr_sophia_02', 'usr_riya_08', 'usr_aisha_09']
  },
  {
    id: 'grp_05',
    name: 'AI & Machine Learning Guild',
    subject: 'Artificial Intelligence',
    description: 'Reading group for NeurIPS/ICLR papers, PyTorch hands-on tutorials, Kaggle competitions, and generative AI discussions.',
    visibility: 'public',
    created_by: 'usr_sophia_02',
    creator_name: 'Sophia Patel',
    max_members: 40,
    member_count: 35,
    schedule: 'Sundays, 6:00 PM EST',
    tags: ['Deep Learning', 'PyTorch', 'Transformers', 'Kaggle'],
    members: ['usr_sophia_02', 'usr_alex_01', 'usr_riya_08']
  }
];

export const INITIAL_TASKS = [
  {
    id: 'tsk_01',
    user_id: 'usr_alex_01',
    title: 'Review Red-Black Tree Balance Invariants',
    subject: 'Data Structures',
    description: 'Walk through left-rotations and right-rotations with pencil & paper before Thursday lecture.',
    priority: 'High',
    difficulty: 'Medium', // +50 XP
    is_topic: false,
    xp_reward: 50,
    deadline: new Date(Date.now() + 86400000).toISOString(),
    estimated_minutes: 60,
    completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'tsk_02',
    user_id: 'usr_alex_01',
    title: 'Solve 3 LeetCode Hard Graph Problems',
    subject: 'Algorithms',
    description: 'Focus on BFS shortest path in unweighted grid, Tarjan SCC, and cycle detection.',
    priority: 'Urgent',
    difficulty: 'Hard', // +100 XP
    is_topic: false,
    xp_reward: 100,
    deadline: new Date(Date.now() + 172800000).toISOString(),
    estimated_minutes: 90,
    completed: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'tsk_03',
    user_id: 'usr_alex_01',
    title: 'Complete Gradient Descent & Backprop Module',
    subject: 'Machine Learning',
    description: 'Full syllabus module verification: loss convergence curve on synthetic polynomial dataset and backprop derivation.',
    priority: 'Urgent',
    difficulty: 'Hard',
    is_topic: true, // +150 XP Syllabus Topic!
    xp_reward: 150,
    deadline: new Date(Date.now() + 43200000).toISOString(),
    estimated_minutes: 120,
    completed: true,
    completed_at: new Date(Date.now() - 3600000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 'tsk_04',
    user_id: 'usr_alex_01',
    title: 'Prepare Chapter 4 TCP/IP Summary Notes',
    subject: 'Computer Networks',
    description: 'TCP 3-way handshake vs UDP header differences and congestion control algorithms.',
    priority: 'Low',
    difficulty: 'Easy', // +25 XP
    is_topic: false,
    xp_reward: 25,
    deadline: new Date(Date.now() + 259200000).toISOString(),
    estimated_minutes: 45,
    completed: false,
    created_at: new Date().toISOString()
  }
];

export const AVAILABLE_SUBJECTS = [
  'Data Structures',
  'Algorithms',
  'Machine Learning',
  'Computer Networks',
  'Operating Systems',
  'System Design',
  'Web Development',
  'Linear Algebra',
  'Calculus I',
  'Calculus III',
  'Discrete Mathematics',
  'Probability & Statistics',
  'Classical Mechanics',
  'Electromagnetism',
  'Thermodynamics',
  'Digital Logic Design',
  'Signals & Systems',
  'Deep Learning',
  'Computer Vision',
  'Software Engineering'
];

export const STUDY_TIMINGS = [
  'Morning (6AM - 10AM)',
  'Afternoon (12PM - 4PM)',
  'Evening (5PM - 9PM)',
  'Late Night (9PM - 1AM)',
  'Flexible'
];

export const LEARNING_GOALS = [
  'Exam Prep',
  'Competitive Programming',
  'Side Projects',
  'Coursework Mastery',
  'Interview Prep',
  'Research Paper Reading',
  'Lab Assignments',
  'Hackathon Teaming'
];

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

export const COLLEGE_LIST = [
  'Stanford University',
  'UC Berkeley',
  'MIT',
  'Georgia Tech',
  'University of Michigan',
  'UT Austin',
  'Carnegie Mellon University',
  'Harvard University',
  'Columbia University',
  'UIUC',
  'University of Washington',
  'Purdue University',
  'Cornell University'
];
