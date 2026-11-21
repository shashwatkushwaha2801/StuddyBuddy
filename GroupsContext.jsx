import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { INITIAL_GROUPS } from '../lib/mockData';
import { XP_REWARDS } from '../lib/rankSystem';
import confetti from 'canvas-confetti';

const GroupsContext = createContext(null);
const STORAGE_KEY_GROUPS = 'studybuddy_groups_v2';

export function GroupsProvider({ children }) {
  const { currentUser, allProfiles, addXP } = useAuth();

  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading groups:', e);
    }
    return INITIAL_GROUPS;
  });

  const [filterSubject, setFilterSubject] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
  }, [groups]);

  /**
   * Create a new real study group (awards +20 XP)
   */
  const createGroup = ({ name, subject, description, visibility = 'public', schedule, tags = [] }) => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };

    const newGroup = {
      id: `grp_${Date.now()}`,
      name,
      subject,
      description: description || '',
      visibility,
      created_by: currentUser.id,
      creator_name: currentUser.full_name,
      max_members: 50,
      member_count: 1,
      schedule: schedule || 'Weekly Schedule (TBD)',
      tags: tags.length > 0 ? tags : [subject],
      members: [currentUser.id],
      created_at: new Date().toISOString()
    };

    setGroups(prev => [newGroup, ...prev]);

    if (addXP) {
      addXP(XP_REWARDS.COLLABORATION, `Founded Study Group: ${name}`, 'Group Founded');
    }

    try {
      confetti({ particleCount: 50, spread: 55, origin: { y: 0.7 } });
    } catch (e) {}

    return { success: true, group: newGroup };
  };

  /**
   * Join a group (awards +20 XP)
   */
  const joinGroup = (groupId) => {
    if (!currentUser) return;
    const group = groups.find(g => g.id === groupId);

    setGroups(prev =>
      prev.map(grp => {
        if (grp.id === groupId && !grp.members.includes(currentUser.id)) {
          const updatedMembers = [...grp.members, currentUser.id];
          return {
            ...grp,
            members: updatedMembers,
            member_count: updatedMembers.length
          };
        }
        return grp;
      })
    );

    if (group && !group.members.includes(currentUser.id) && addXP) {
      addXP(XP_REWARDS.COLLABORATION, `Joined Study Group: ${group.name}`, 'Group Collaboration');
      try {
        confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
      } catch (e) {}
    }
  };

  /**
   * Leave a group
   */
  const leaveGroup = (groupId) => {
    if (!currentUser) return;
    setGroups(prev =>
      prev.map(grp => {
        if (grp.id === groupId && grp.members.includes(currentUser.id)) {
          const updatedMembers = grp.members.filter(m => m !== currentUser.id);
          return {
            ...grp,
            members: updatedMembers,
            member_count: updatedMembers.length
          };
        }
        return grp;
      })
    );
  };

  /**
   * Check if current user is member
   */
  const isMember = (groupId) => {
    if (!currentUser) return false;
    const group = groups.find(g => g.id === groupId);
    return Boolean(group && group.members.includes(currentUser.id));
  };

  /**
   * Get members with full profiles for a group
   */
  const getGroupMembers = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    return group.members
      .map(memberId => allProfiles.find(p => p.id === memberId))
      .filter(Boolean);
  };

  // Filtered groups
  const filteredGroups = groups.filter(g => {
    const matchSubject = filterSubject === 'all' || g.subject.toLowerCase() === filterSubject.toLowerCase();
    const matchSearch = !searchQuery || 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSubject && matchSearch;
  });

  return (
    <GroupsContext.Provider
      value={{
        groups,
        filteredGroups,
        filterSubject,
        setFilterSubject,
        searchQuery,
        setSearchQuery,
        createGroup,
        joinGroup,
        leaveGroup,
        isMember,
        getGroupMembers,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
}
