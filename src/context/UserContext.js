import React, {createContext, useContext, useMemo, useState} from 'react';

import {mockUser as MOCK_USER} from '../data/mockPlants';

const UserContext = createContext(undefined);

export function UserProvider({children}) {
  const [user, setUser] = useState(() => ({...MOCK_USER}));

  const updateUser = updates => {
    setUser(prev => ({...prev, ...updates}));
  };

  const value = useMemo(() => ({user, updateUser}), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
