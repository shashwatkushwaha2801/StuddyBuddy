/**
 * StudyBuddy Smart Partner Matching Algorithm
 * 
 * Formula:
 * - Common subjects: 50%
 * - Compatible study timings: 25%
 * - Similar learning goals: 25%
 * 
 * If two students share all their selected subjects, have the same study timing
 * and similar learning goals, their compatibility score is 100%.
 */

// Timing adjacency mapping for partial compatibility
const TIMING_ORDER = ['Morning', 'Afternoon', 'Evening', 'Late Night'];

/**
 * Normalize string for comparison
 */
const norm = (str) => (str || '').trim().toLowerCase();

/**
 * Calculate compatibility between current user profile and a candidate profile
 */
export function calculateCompatibility(user, candidate) {
  if (!user || !candidate || user.id === candidate.id) {
    return {
      score: 0,
      subjectScore: 0,
      timingScore: 0,
      goalScore: 0,
      commonSubjects: [],
      commonGoals: [],
      timingMatchStatus: 'None'
    };
  }

  // 1. Common Subjects (50% max)
  const userSubjects = (user.subjects || []).map(norm).filter(Boolean);
  const candSubjects = (candidate.subjects || []).map(norm).filter(Boolean);

  let commonSubjects = [];
  let subjectScore = 0;

  if (userSubjects.length > 0 && candSubjects.length > 0) {
    // Find shared subjects preserving candidate's original display casing
    commonSubjects = (candidate.subjects || []).filter(cs => 
      userSubjects.includes(norm(cs))
    );

    // Overlap calculation:
    // If all user subjects are matched in candidate or vice-versa, ratio reaches up to 1.0
    const unionSize = new Set([...userSubjects, ...candSubjects]).size;
    const maxLen = Math.max(userSubjects.length, candSubjects.length);
    
    // Balanced overlap ratio
    const matchRatio = commonSubjects.length / (maxLen || 1);
    subjectScore = Math.round(matchRatio * 50);
  } else if (userSubjects.length === 0 && candSubjects.length === 0) {
    // Graceful handling of missing/unset subjects
    subjectScore = 20; // baseline neutral
  }

  // 2. Compatible Study Timings (25% max)
  const userTiming = norm(user.study_timing || user.preferred_study_time || '');
  const candTiming = norm(candidate.study_timing || candidate.preferred_study_time || '');

  let timingScore = 0;
  let timingMatchStatus = 'Different';

  if (!userTiming || !candTiming) {
    timingScore = 12; // neutral midpoint
    timingMatchStatus = 'Flexible / Unspecified';
  } else if (userTiming === candTiming) {
    timingScore = 25; // Exact match
    timingMatchStatus = 'Exact Match';
  } else if (userTiming.includes('flexible') || candTiming.includes('flexible')) {
    timingScore = 22; // Very compatible
    timingMatchStatus = 'Flexible Timing';
  } else {
    // Check if timings are adjacent (e.g. Afternoon & Evening)
    const userIndex = TIMING_ORDER.findIndex(t => userTiming.includes(norm(t)));
    const candIndex = TIMING_ORDER.findIndex(t => candTiming.includes(norm(t)));

    if (userIndex !== -1 && candIndex !== -1 && Math.abs(userIndex - candIndex) === 1) {
      timingScore = 15; // Adjacent timeslot
      timingMatchStatus = 'Adjacent Slots';
    } else {
      timingScore = 5; // Minimal overlap
      timingMatchStatus = 'Different Hours';
    }
  }

  // 3. Similar Learning Goals (25% max)
  const userGoals = (user.learning_goals || []).map(norm).filter(Boolean);
  const candGoals = (candidate.learning_goals || []).map(norm).filter(Boolean);

  let commonGoals = [];
  let goalScore = 0;

  if (userGoals.length > 0 && candGoals.length > 0) {
    commonGoals = (candidate.learning_goals || []).filter(cg =>
      userGoals.includes(norm(cg))
    );

    const maxGoals = Math.max(userGoals.length, candGoals.length);
    const goalRatio = commonGoals.length / (maxGoals || 1);
    goalScore = Math.round(goalRatio * 25);
  } else if (userGoals.length === 0 && candGoals.length === 0) {
    goalScore = 10; // neutral fallback
  }

  // Total Score: 0 to 100
  let totalScore = subjectScore + timingScore + goalScore;
  if (totalScore > 100) totalScore = 100;
  if (totalScore < 0) totalScore = 0;

  return {
    score: totalScore,
    subjectScore,
    timingScore,
    goalScore,
    commonSubjects,
    commonGoals,
    timingMatchStatus,
  };
}

/**
 * Filter, sort, and rank candidate profiles against logged-in user
 */
export function rankStudyPartners(currentUser, candidateProfiles, filters = {}) {
  if (!currentUser || !Array.isArray(candidateProfiles)) return [];

  // Exclude current user from recommendations
  const validCandidates = candidateProfiles.filter(p => p && p.id !== currentUser.id);

  const scoredCandidates = validCandidates.map(candidate => {
    const compatibility = calculateCompatibility(currentUser, candidate);
    return {
      ...candidate,
      compatibility
    };
  });

  // Apply optional UI filters
  let filtered = scoredCandidates;

  if (filters.search) {
    const q = norm(filters.search);
    filtered = filtered.filter(p => 
      norm(p.full_name).includes(q) ||
      norm(p.college).includes(q) ||
      norm(p.branch).includes(q) ||
      (p.subjects || []).some(s => norm(s).includes(q))
    );
  }

  if (filters.subject && filters.subject !== 'all') {
    const targetSub = norm(filters.subject);
    filtered = filtered.filter(p => 
      (p.subjects || []).some(s => norm(s).includes(targetSub))
    );
  }

  if (filters.timing && filters.timing !== 'all') {
    const targetTime = norm(filters.timing);
    filtered = filtered.filter(p => 
      norm(p.study_timing).includes(targetTime)
    );
  }

  if (filters.year && filters.year !== 'all') {
    filtered = filtered.filter(p => p.year === filters.year);
  }

  if (filters.minScore && filters.minScore > 0) {
    filtered = filtered.filter(p => p.compatibility.score >= filters.minScore);
  }

  // Sort strictly descending by compatibility score
  filtered.sort((a, b) => b.compatibility.score - a.compatibility.score);

  return filtered;
}
