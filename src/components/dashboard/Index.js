/* eslint-disable arrow-body-style */
import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/profile.context';
import { database } from '../../misc/firebase';
import { getUserUpdates } from '../../misc/helpers';
import EditableInput from '../EditableInput';
import AvatarUploadBtn from './AvatarUploadBtn';
import ProviderBlock from './ProviderBlock';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async newData => {

    // below code was previously used code to update name in database which was replaces with updates variable and getUserUpdates function and its below update code
    //   updating the database with new name
    // const userNicknameRef=database.ref(`profiles/${profile.uid}`).child('name');
    try {
        // await userNicknameRef.set(newData);

        // below helper function is in helper.js
        const updates=await getUserUpdates(profile.uid,'name',newData,database);
        await database.ref().update(updates);
        Alert.info('nickname has been updated',4000);
    } catch (error) {
        Alert.error(error.message,4000)
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>
      <Drawer.Body>
        Hey, {profile.name}
        <ProviderBlock/>
        <Divider />
        <EditableInput
          name='nickname'
          initialValue={profile.name}
          onSave={onSave}
          label={<h6 className="mb-2">Nickname</h6>}
        />
        <AvatarUploadBtn/>
      </Drawer.Body>
      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
