/* eslint-disable arrow-body-style */
import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../misc/helpers';

const ProfileAvatar = ({ name, ...Avatarprops}) => {
    // check rsuite doc for avatar component(basically if no image is provided then it shows the name provided inside the component)
  return <Avatar circle {...Avatarprops}>
      {getNameInitials(name)}
  </Avatar>;
};

export default ProfileAvatar;
