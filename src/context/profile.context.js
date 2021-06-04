/* eslint-disable import/no-extraneous-dependencies */
import firebase from 'firebase/app'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../misc/firebase';

export const isOfflineForDatabase = {
state: 'offline',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const isOnlineForDatabase = {
  state: 'online',
  last_changed: firebase.database.ServerValue.TIMESTAMP,
};

const ProfileContext = createContext();
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null); // we just do not disturctured the second variable here in usestate
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let userRef;
    let userStatusRef;
    const authUnsub = auth.onAuthStateChanged(authObj => {
      if (authObj) {
        
        userStatusRef = database.ref(`/status/${authObj.uid}`);
        userRef=database.ref(`/profiles/${authObj.uid}`)

        userRef.on('value', snap => {
          const { name, createdAt, avatar } = snap.val();
          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };
          setProfile(data);
          setIsLoading(false);
        });

        // below code form real time presence doc


        database.ref('.info/connected').on('value', (snapshot)=> {
          // If we're not currently connected, don't do anything.
          // snapshot.val() might not be a boolean, therefore to convert to a boolean put double negation
          if (!!snapshot.val() === false) {
              return;
          };
      
          // If we are currently connected, then use the 'onDisconnect()' 
          // method to add a set which will only trigger once this 
          // client has disconnected by closing the app, 
          // losing internet, or any other means.
          userStatusRef.onDisconnect().set(isOfflineForDatabase).then(()=> {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect() 
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
      
              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusRef.set(isOnlineForDatabase);
          });
      });
      } else {
        // below when we sign off
        if(userRef){
          userRef.off();
        }
        if(userStatusRef){
          userStatusRef.off()
        }
        database.ref('.info/connected').off()
        setProfile(null);
        setIsLoading(false);
      }
    });

    // below whenever we unmount the component
    return () => {
      authUnsub();
      database.ref('.info/connected').off()
      if(userRef){
        userRef.off();
      }
      if(userStatusRef){
        userStatusRef.off()
      }
    };
  }, []);
  return (
    <ProfileContext.Provider value={{ isLoading, profile }}>
      {children}
    </ProfileContext.Provider>
  );
};
export const useProfile = () => useContext(ProfileContext);
