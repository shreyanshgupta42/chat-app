/* eslint-disable arrow-body-style */
import React from 'react';
import { useParams } from 'react-router';
import { Loader } from 'rsuite';
import ChatTop from '../../components/chat-window/top';
import Messages from '../../components/chat-window/messages';
import ChatBottom from '../../components/chat-window/bottom';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomProvider } from '../../context/current-room.context';
import { transformToArr } from '../../misc/helpers';
import { auth } from '../../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    return <Loader center vertical size="md" content="Loading" speed="slow" />;
  }

  const currentRoom = rooms.find(room => room.id === chatId);
  if (!currentRoom) {
    return <h6 className="text-center mt-page">chat {chatId} not found</h6>;
  }
  const { name, description } = currentRoom;

  // since we have admins as a object in database, therefore we have to convert object into array(since we need array here to show admin)
  const admins = transformToArr(currentRoom.admins);
  const isAdmin = admins.includes(auth.currentUser.uid);

  const currentRoomData = {
    name,
    description,
    admins,
    isAdmin,
  };
  return (
    <CurrentRoomProvider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomProvider>
  );
};

export default Chat;
