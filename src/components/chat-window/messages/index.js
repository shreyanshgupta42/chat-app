/* eslint-disable arrow-body-style */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { database } from '../../../misc/firebase';
import { transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const [messages, setMessages] = useState(null);
  const { chatId } = useParams();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    // reference to the messages section in database
    const messagesRef = database.ref('/messages');

    //  below is a realtime subscription
    messagesRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      });

    // dismounting time
    return () => {
      // unsubscribe to the subcribed item which is neccessary
      messagesRef.off('value');
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async uid => {
      const adminsRef = database.ref(`/rooms/${chatId}/admins`);
      let AlertMsg;
      await adminsRef.transaction(admins => {
        if (admins) {
          if (admins[uid]) {
            // null means the data is deleted form the database, null values are not stored
            // and admins permission is taken
            admins[uid]=null;
            AlertMsg='Admins permission is Removed'
          } else {
            admins[uid] = true;
            AlertMsg='Admins permission is Granted'
          }
        }
        return admins;
      });
      Alert.info(AlertMsg,4000)
    },
    [chatId]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>no messages yet</li>}
      {canShowMessages &&
        messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />)}
    </ul>
  );
};

export default Messages;
