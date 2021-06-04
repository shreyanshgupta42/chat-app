/* eslint-disable arrow-body-style */
import React, { useCallback } from 'react';
import { Alert, Button, Drawer, Icon } from 'rsuite';
import { isOfflineForDatabase } from '../../context/profile.context';
import { useMediaQuery, useModelState } from '../../misc/custom-hooks';
import { auth, database } from '../../misc/firebase';
import Dashboard from './Index';

const DashboardToggle = () => {
  const { isOpen, close, open } = useModelState();
  const isMobile = useMediaQuery('(max-width:992px)');
  const onSignOut = useCallback(() => {
    // later modified code(to correct offline doing when we signout)
    database.ref(`/status/${auth.currentUser.uid}`).set(isOfflineForDatabase).then(()=>{
      auth.signOut();
      Alert.info('Signed Out', 4000);
      close();
    }).catch(error=>{

      Alert.error(error.message, 4000);
    }
    );
    //
  }, [close]);
  return (
    <>
      <Button block color="blue" onClick={open}>
        <Icon icon='dashboard' />
        Dashboard
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close} placement="left">
        <Dashboard onSignOut={onSignOut} />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
