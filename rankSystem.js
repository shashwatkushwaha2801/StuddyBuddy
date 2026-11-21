/**
 * StudyBuddy Gamification & Competitive Ranking System
 * Free Fire inspired rank progression tiers and XP calculations.
 */

export const RANK_TIERS = [
  // Bronze: 0 - 299 XP
  { tier: 'Bronze', division: 'I', fullName: 'Bronze I', minXP: 0, maxXP: 99, color: 'bronze', icon: 'Shield' },
  { tier: 'Bronze', division: 'II', fullName: 'Bronze II', minXP: 100, maxXP: 199, color: 'bronze', icon: 'Shield' },
  { tier: 'Bronze', division: 'III', fullName: 'Bronze III', minXP: 200, maxXP: 299, color: 'bronze', icon: 'Shield' },

  // Silver: 300 - 699 XP
  { tier: 'Silver', division: 'I', fullName: 'Silver I', minXP: 300, maxXP: 429, color: 'silver', icon: 'ShieldCheck' },
  { tier: 'Silver', division: 'II', fullName: 'Silver II', minXP: 430, maxXP: 559, color: 'silver', icon: 'ShieldCheck' },
  { tier: 'Silver', division: 'III', fullName: 'Silver III', minXP: 560, maxXP: 699, color: 'silver', icon: 'ShieldCheck' },

  // Gold: 700 - 1,299 XP
  { tier: 'Gold', division: 'I', fullName: 'Gold I', minXP: 700, maxXP: 849, color: 'gold', icon: 'Award' },
  { tier: 'Gold', division: 'II', fullName: 'Gold II', minXP: 850, maxXP: 999, color: 'gold', icon: 'Award' },
  { tier: 'Gold', division: 'III', fullName: 'Gold III', minXP: 1000, maxXP: 1149, color: 'gold', icon: 'Award' },
  { tier: 'Gold', division: 'IV', fullName: 'Gold IV', minXP: 1150, maxXP: 1299, color: 'gold', icon: 'Award' },

  // Platinum: 1,300 - 2,099 XP
  { tier: 'Platinum', division: 'I', fullName: 'Platinum I', minXP: 1300, maxXP: 1499, color: 'platinum', icon: 'Zap' },
  { tier: 'Platinum', division: 'II', fullName: 'Platinum II', minXP: 1500, maxXP: 1699, color: 'platinum', icon: 'Zap' },
  { tier: 'Platinum', division: 'III', fullName: 'Platinum III', minXP: 1700, maxXP: 1899, color: 'platinum', icon: 'Zap' },
  { tier: 'Platinum', division: 'IV', fullName: 'Platinum IV', minXP: 1900, maxXP: 2099, color: 'platinum', icon: 'Zap' },

  // Diamond: 2,100 - 3,199 XP
  { tier: 'Diamond', division: 'I', fullName: 'Diamond I', minXP: 2100, maxXP: 2369, color: 'diamond', icon: 'Gem' },
  { tier: 'Diamond', division: 'II', fullName: 'Diamond II', minXP: 2370, maxXP: 2639, color: 'diamond', icon: 'Gem' },
  { tier: 'Diamond', division: 'III', fullName: 'Diamond III', minXP: 2640, maxXP: 2919, color: 'diamond', icon: 'Gem' },
  { tier: 'Diamond', division: 'IV', fullName: 'Diamond IV', minXP: 2920, maxXP: 3199, color: 'diamond', icon: 'Gem' },

  // Heroic: 3,200 - 4,499 XP
  { tier: 'Heroic', division: '', fullName: 'Heroic', minXP: 3200, maxXP: 4499, color: 'heroic', icon: 'Flame' },

  // Grandmaster: 4,500+ XP
  { tier: 'Grandmaster', division: '', fullName: 'Grandmaster', minXP: 4500, maxXP: Infinity, color: 'grandmaster', icon: 'Crown' }
];

export const XP_REWARDS = {
  TASK_EASY: 25,
  TASK_MEDIUM: 50,
  TASK_HARD: 100,
  TOPIC_MODULE: 150,
  DAILY_STREAK: 30,
  COLLABORATION: 20
};

export const TIER_THEMES = {
  bronze: {
    name: 'Bronze',
    bgBadge: 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900',
    textBadge: 'text-amber-100',
    border: 'border-amber-700/60',
    pillBg: 'bg-amber-100 text-amber-900 border-amber-300',
    cardGradient: 'from-amber-900/10 to-amber-800/5',
    accentText: 'text-amber-700',
    glow: 'shadow-amber-900/20',
    metallic: 'from-amber-600 via-yellow-700 to-amber-800'
  },
  silver: {
    name: 'Silver',
    bgBadge: 'bg-gradient-to-r from-slate-400 via-slate-500 to-slate-600',
    textBadge: 'text-white',
    border: 'border-slate-300',
    pillBg: 'bg-slate-100 text-slate-800 border-slate-300',
    cardGradient: 'from-slate-200/50 to-slate-100/30',
    accentText: 'text-slate-600',
    glow: 'shadow-slate-500/20',
    metallic: 'from-slate-300 via-slate-200 to-slate-400'
  },
  gold: {
    name: 'Gold',
    bgBadge: 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600',
    textBadge: 'text-amber-950 font-bold',
    border: 'border-amber-400',
    pillBg: 'bg-amber-50 text-amber-900 border-amber-300 font-semibold',
    cardGradient: 'from-amber-50 to-yellow-50',
    accentText: 'text-amber-600',
    glow: 'shadow-amber-500/30',
    metallic: 'from-yellow-300 via-amber-400 to-yellow-500'
  },
  platinum: {
    name: 'Platinum',
    bgBadge: 'bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600',
    textBadge: 'text-white font-bold',
    border: 'border-cyan-400',
    pillBg: 'bg-cyan-50 text-cyan-900 border-cyan-300 font-semibold',
    cardGradient: 'from-cyan-50 to-teal-50',
    accentText: 'text-cyan-600',
    glow: 'shadow-cyan-500/30',
    metallic: 'from-cyan-300 via-teal-400 to-cyan-500'
  },
  diamond: {
    name: 'Diamond',
    bgBadge: 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-700',
    textBadge: 'text-white font-bold',
    border: 'border-purple-400',
    pillBg: 'bg-purple-50 text-purple-900 border-purple-300 font-semibold',
    cardGradient: 'from-purple-50 to-fuchsia-50',
    accentText: 'text-purple-600',
    glow: 'shadow-purple-500/30',
    metallic: 'from-purple-400 via-pink-400 to-indigo-500'
  },
  heroic: {
    name: 'Heroic',
    bgBadge: 'bg-gradient-to-r from-rose-600 via-red-600 to-red-800',
    textBadge: 'text-white font-bold tracking-wide',
    border: 'border-rose-500 ring-1 ring-rose-400/50',
    pillBg: 'bg-rose-50 text-rose-900 border-rose-300 font-bold',
    cardGradient: 'from-rose-50 to-red-50',
    accentText: 'text-rose-600',
    glow: 'shadow-red-600/40',
    metallic: 'from-red-500 via-rose-500 to-red-700'
  },
  grandmaster: {
    name: 'Grandmaster',
    bgBadge: 'bg-gradient-to-r from-amber-400 via-rose-600 to-red-700',
    textBadge: 'text-white font-black tracking-wider animate-pulse',
    border: 'border-amber-300 ring-2 ring-amber-400/60 shadow-lg',
    pillBg: 'bg-gradient-to-r from-amber-100 to-rose-100 text-rose-950 border-amber-400 font-extrabold',
    cardGradient: 'from-amber-100/50 via-rose-50 to-red-100/40',
    accentText: 'text-rose-700',
    glow: 'shadow-amber-500/50',
    metallic: 'from-amber-300 via-red-500 to-amber-400'
  }
};

/**
 * Get full rank details from given XP
 */
export function getRankFromXP(rawXP = 0) {
  const xp = Math.max(0, parseInt(rawXP, 10) || 0);

  // Find corresponding rank bracket
  let currentRank = RANK_TIERS[0];
  let rankIndex = 0;

  for (let i = 0; i < RANK_TIERS.length; i++) {
    const tier = RANK_TIERS[i];
    if (xp >= tier.minXP && (tier.maxXP === Infinity || xp <= tier.maxXP)) {
      currentRank = tier;
      rankIndex = i;
      break;
    }
  }

  const nextRank = rankIndex < RANK_TIERS.length - 1 ? RANK_TIERS[rankIndex + 1] : null;
  const isMaxRank = !nextRank;

  let progressPercent = 100;
  let xpNeededForNext = 0;
  let currentTierXP = xp - currentRank.minXP;
  let tierRange = 0;

  if (nextRank) {
    tierRange = nextRank.minXP - currentRank.minXP;
    xpNeededForNext = Math.max(0, nextRank.minXP - xp);
    progressPercent = Math.min(100, Math.max(0, Math.round((currentTierXP / tierRange) * 100)));
  }

  const theme = TIER_THEMES[currentRank.color] || TIER_THEMES.bronze;

  return {
    ...currentRank,
    xp,
    nextRank,
    isMaxRank,
    xpNeededForNext,
    currentTierXP,
    tierRange,
    progressPercent,
    theme
  };
}

/**
 * Detect if XP change crosses into a new tier or subdivision
 */
export function didRankUp(oldXP = 0, newXP = 0) {
  if (newXP <= oldXP) return null;
  const oldRank = getRankFromXP(oldXP);
  const newRank = getRankFromXP(newXP);

  if (newRank.fullName !== oldRank.fullName) {
    return {
      leveledUp: true,
      previousRank: oldRank,
      newRank: newRank,
      tierChanged: oldRank.tier !== newRank.tier
    };
  }
  return null;
}
