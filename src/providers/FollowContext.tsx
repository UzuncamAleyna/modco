// FollowContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';

const FollowContext = createContext({});

export const FollowProvider = ({ children }) => {
  const [followedShops, setFollowedShops] = useState([]);
  const { session } = useAuth();

  const fetchFollowedShops = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from('followers')
      .select('shop_id')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error fetching followed shops:', error);
    } else {
      setFollowedShops(data.map(follow => follow.shop_id));
    }
  };

  const followShop = async (shopId) => {
    if (!session) return;
    const { error } = await supabase
      .from('followers')
      .insert({ shop_id: shopId, user_id: session.user.id });

    if (error) {
      console.error('Error following shop:', error);
    } else {
      setFollowedShops(prev => [...prev, shopId]);
    }
  };

  const unfollowShop = async (shopId) => {
    if (!session) return;
    const { error } = await supabase
      .from('followers')
      .delete()
      .eq('shop_id', shopId)
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Error unfollowing shop:', error);
    } else {
      setFollowedShops(prev => prev.filter(id => id !== shopId));
    }
  };

  return (
    <FollowContext.Provider value={{ followedShops, followShop, unfollowShop, fetchFollowedShops }}>
      {children}
    </FollowContext.Provider>
  );
};

export const useFollow = () => useContext(FollowContext);
