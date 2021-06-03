/* eslint-disable arrow-body-style */
import React from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

const CurrentRoomContext = createContext();

// this context will carry children of the being provided component as well as some data
export const CurrentRoomProvider = ({ children, data }) => {
  //  so below we take children and data, and return data only so this context is only acting as a middle man
  return (
    <CurrentRoomContext.Provider value={data}>
      {children}
    </CurrentRoomContext.Provider>
  );
};

// below we context it into our custom hooks
export const useCurrentRoom = selector =>
  useContextSelector(CurrentRoomContext, selector);
