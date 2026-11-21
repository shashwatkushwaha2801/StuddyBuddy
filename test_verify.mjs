import { calculateCompatibility, rankStudyPartners } from './client/src/lib/matchingAlgorithm.js';
import { getRankFromXP, didRankUp, RANK_TIERS, XP_REWARDS } from './client/src/lib/rankSystem.js';
import { INITIAL_STUDENTS, INITIAL_GROUPS, INITIAL_TASKS } from './client/src/lib/mockData.js';

console.log('=== 1. TESTING FREE FIRE STYLE RANK TIERS ===');
const ranks = [0, 99, 100, 299, 300, 699, 700, 1299, 1300, 2099, 2100, 3199, 3200, 4499, 4500, 5200];
ranks.forEach(xp => {
  const r = getRankFromXP(xp);
  console.log(`XP: ${xp.toString().padStart(5)} -> [${r.tier.padEnd(11)}] ${r.fullName.padEnd(15)} Next: ${r.isMaxRank ? 'MAX REACHED' : r.nextRank?.fullName} (${r.xpNeededForNext} XP needed)`);
});

console.log('\n=== 2. TESTING RANK PROMOTION DETECTOR ===');
const promotion1 = didRankUp(280, 320);
console.log('280 -> 320 XP:', promotion1?.leveledUp ? `PROMOTED: ${promotion1.previousRank.fullName} -> ${promotion1.newRank.fullName} (Tier changed: ${promotion1.tierChanged})` : 'No promotion');

const promotion2 = didRankUp(2080, 2150);
console.log('2080 -> 2150 XP:', promotion2?.leveledUp ? `PROMOTED: ${promotion2.previousRank.fullName} -> ${promotion2.newRank.fullName} (Tier changed: ${promotion2.tierChanged})` : 'No promotion');

const promotion3 = didRankUp(4450, 4550);
console.log('4450 -> 4550 XP:', promotion3?.leveledUp ? `PROMOTED: ${promotion3.previousRank.fullName} -> ${promotion3.newRank.fullName} (Tier changed: ${promotion3.tierChanged})` : 'No promotion');

console.log('\n=== 3. TESTING 50%/25%/25% WEIGHTED MATCHING ENGINE ===');
const alex = INITIAL_STUDENTS[0];
console.log(`Current User: ${alex.full_name} (${alex.college}, Branch: ${alex.branch})`);
console.log(`Subjects: [${alex.subjects.join(', ')}]`);
console.log(`Timing: ${alex.study_timing} | Goals: [${alex.learning_goals.join(', ')}]`);

const matches = rankStudyPartners(alex, INITIAL_STUDENTS);
console.log(`\nFound ${matches.length} matches (Self-exclusion check: ${!matches.some(m => m.id === alex.id) ? 'PASSED' : 'FAILED'}):`);

matches.forEach((m, idx) => {
  console.log(`  #${idx + 1} ${m.full_name.padEnd(16)} | Compatibility: ${(m.compatibility.score + '%').padEnd(5)} | Common Subjects (50%): ${m.compatibility.subjectScore}/50 | Timing (25%): ${m.compatibility.timingScore}/25 | Goals (25%): ${m.compatibility.goalScore}/25`);
  console.log(`     -> Overlap Subjects: [${m.compatibility.commonSubjects.join(', ')}]`);
});

console.log('\n=== ALL UNIT TESTS EXECUTED SUCCESSFULLY ===');
