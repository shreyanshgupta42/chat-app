/* eslint-disable arrow-body-style */
import React from 'react';
import { Button, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';

const Dashboard = ({onSignOut}) => {

    const {profile}=useProfile();
  return <>
    <Drawer.Header>
        <Drawer.Title>
            Dashboard
        </Drawer.Title>
    </Drawer.Header>
    <Drawer.Body>
        Hey, {profile.name}
    </Drawer.Body>
    <Drawer.Footer>
        <Button block color='red' onClick={onSignOut} >Sign out</Button>
    </Drawer.Footer>
  </>;
};

export default Dashboard;
