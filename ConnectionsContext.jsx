import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { XP_REWARDS } from '../lib/rankSystem';
import confetti from 'canvas-confetti';

const ConnectionsContext = createContext(null);
const STORAGE_KEY_CONNECTIONS = 'studybuddy_connections_v2';
const STORAGE_KEY_MESSAGES = 'studybuddy_messages_v2';

const INITIAL_CONNECTIONS = [
  {
    id: 'req_01',
    sender_id: 'usr_sophia_02',
    receiver_id: 'usr_alex_01',
    status: 'pending',
    message: 'Hey Alex! Saw you are studying Advanced Algorithms and Machine Learning. Would love to partner up and review problem sets!',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'req_02',
    sender_id: 'usr_alex_01',
    receiver_id: 'usr_david_05',
    status: 'accepted',
    message: 'Let us practice LeetCode and System Design before tech interviews!',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'req_03',
    sender_id: 'usr_marcus_03',
    receiver_id: 'usr_alex_01',
    status: 'pending',
    message: 'Would love to study Discrete Mathematics and Proofs together.',
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  }
];

const INITIAL_MESSAGES = [
  {
    id: 'msg_01',
    sender_id: 'usr_david_05',
    receiver_id: 'usr_alex_01',
    text: 'Hey Alex! Glad we connected. When are you free for the mock system design session?',
    created_at: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'msg_02',
    sender_id: 'usr_alex_01',
    receiver_id: 'usr_david_05',
    text: 'Tomorrow evening around 7 PM works great for me! I will prepare some notes on distributed caching.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  }
];

export function ConnectionsProvider({ children }) {
  const { currentUser, allProfiles, addXP } = useAuth();

  const [connections, setConnections] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading connections:', e);
    }
    return INITIAL_CONNECTIONS;
  });

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading messages:', e);
    }
    return INITIAL_MESSAGES;
  });

  // Save changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  // Derived connection lists for the current user
  const receivedRequests = connections
    .filter(c => c.receiver_id === currentUser?.id && c.status === 'pending')
    .map(c => ({
      ...c,
      student: allProfiles.find(p => p.id === c.sender_id)
    }))
    .filter(c => Boolean(c.student));

  const sentRequests = connections
    .filter(c => c.sender_id === currentUser?.id && c.status === 'pending')
    .map(c => ({
      ...c,
      student: allProfiles.find(p => p.id === c.receiver_id)
    }))
    .filter(c => Boolean(c.student));

  const acceptedConnections = connections
    .filter(c => (c.sender_id === currentUser?.id || c.receiver_id === currentUser?.id) && c.status === 'accepted')
    .map(c => {
      const partnerId = c.sender_id === currentUser?.id ? c.receiver_id : c.sender_id;
      return {
        ...c,
        partnerId,
        student: allProfiles.find(p => p.id === partnerId)
      };
    })
    .filter(c => Boolean(c.student));

  /**
   * Get connection status with a specific student
   * returns: 'none' | 'pending_sent' | 'pending_received' | 'accepted' | 'rejected'
   */
  const getConnectionStatus = (otherStudentId) => {
    if (!currentUser || currentUser.id === otherStudentId) return 'self';

    const conn = connections.find(c =>
      (c.sender_id === currentUser.id && c.receiver_id === otherStudentId) ||
      (c.sender_id === otherStudentId && c.receiver_id === currentUser.id)
    );

    if (!conn) return 'none';
    if (conn.status === 'accepted') return 'accepted';
    if (conn.status === 'rejected') return 'rejected';
    if (conn.sender_id === currentUser.id) return 'pending_sent';
    return 'pending_received';
  };

  /**
   * Send a connection request
   */
  const sendRequest = (receiverId, customMessage = '') => {
    if (!currentUser) return { success: false, error: 'Must be logged in' };
    if (currentUser.id === receiverId) return { success: false, error: 'Cannot send request to yourself' };

    // Prevent duplicate
    const existing = connections.find(c =>
      ((c.sender_id === currentUser.id && c.receiver_id === receiverId) ||
       (c.sender_id === receiverId && c.receiver_id === currentUser.id)) &&
      (c.status === 'pending' || c.status === 'accepted')
    );

    if (existing) {
      return { success: false, error: existing.status === 'accepted' ? 'Already connected!' : 'Request is already pending!' };
    }

    const newRequest = {
      id: `req_${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      status: 'pending',
      message: customMessage || `Hey! Let's connect and collaborate as study buddies.`,
      created_at: new Date().toISOString()
    };

    setConnections(prev => [newRequest, ...prev]);
    return { success: true, request: newRequest };
  };

  /**
   * Accept a connection request (awards +20 XP for study buddy collaboration!)
   */
  const acceptRequest = (requestId) => {
    const conn = connections.find(c => c.id === requestId);
    setConnections(prev =>
      prev.map(c => (c.id === requestId ? { ...c, status: 'accepted', updated_at: new Date().toISOString() } : c))
    );

    // Award +20 XP
    if (addXP) {
      const partner = allProfiles.find(p => p.id === conn?.sender_id);
      addXP(XP_REWARDS.COLLABORATION, `Connected with ${partner?.full_name || 'Study Partner'}`, 'Buddy Connected');
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  /**
   * Reject a connection request
   */
  const rejectRequest = (requestId) => {
    setConnections(prev =>
      prev.map(c => (c.id === requestId ? { ...c, status: 'rejected', updated_at: new Date().toISOString() } : c))
    );
  };

  /**
   * Cancel pending request or disconnect
   */
  const cancelOrRemoveRequest = (requestId) => {
    setConnections(prev => prev.filter(c => c.id !== requestId));
  };

  /**
   * Cancel request by student ID
   */
  const cancelByStudentId = (otherStudentId) => {
    if (!currentUser) return;
    setConnections(prev =>
      prev.filter(c => !(
        (c.sender_id === currentUser.id && c.receiver_id === otherStudentId) ||
        (c.sender_id === otherStudentId && c.receiver_id === currentUser.id)
      ))
    );
  };

  /**
   * Direct messaging between connected partners
   */
  const getConversation = (partnerId) => {
    if (!currentUser || !partnerId) return [];
    return messages
      .filter(m =>
        (m.sender_id === currentUser.id && m.receiver_id === partnerId) ||
        (m.sender_id === partnerId && m.receiver_id === currentUser.id)
      )
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  const sendMessage = (receiverId, text) => {
    if (!currentUser || !text.trim()) return null;

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender_id: currentUser.id,
      receiver_id: receiverId,
      text: text.trim(),
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  return (
    <ConnectionsContext.Provider
      value={{
        connections,
        receivedRequests,
        sentRequests,
        acceptedConnections,
        getConnectionStatus,
        sendRequest,
        acceptRequest,
        rejectRequest,
        cancelOrRemoveRequest,
        cancelByStudentId,
        getConversation,
        sendMessage
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  );
}

export const useConnections = () => {
  const context = useContext(ConnectionsContext);
  if (!context) throw new Error('useConnections must be used within a ConnectionsProvider');
  return context;
};
