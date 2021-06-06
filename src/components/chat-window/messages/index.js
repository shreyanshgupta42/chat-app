/* eslint-disable arrow-body-style */
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Alert } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
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
            admins[uid] = null;
            AlertMsg = 'Admins permission is Removed';
          } else {
            admins[uid] = true;
            AlertMsg = 'Admins permission is Granted';
          }
        }
        return admins;
      });
      Alert.info(AlertMsg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(async msgId => {
    const {uid} = auth.currentUser;
    const MessageRef = database.ref(`/messages/${msgId}/`);
    let AlertMsg;
    await MessageRef.transaction(msg => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          // null means the data is deleted form the database, null values are not stored
          msg.likes[uid] = null;
          AlertMsg = 'Like Removed';
        } else {
          msg.likeCount += 1;
          // checking if msg.likes object is present or not
          if (!msg.likes) {
            msg.likes = {};
          }
          msg.likes[uid] = true;
          AlertMsg = 'Like Added';
        }
      }
      return msg;
    });
    Alert.info(AlertMsg, 4000);
  }, []);

  const handleDelete=useCallback(async (msgId,file)=>{
    // eslint-disable-next-line no-alert
    if(!window.confirm('Delete this message?')){
      return;
    }
    const isLast=messages[messages.length-1].id===msgId;
    const updates={};

    updates[`/messages/${msgId}`]=null
    if(isLast && messages.length>1){
      updates[`/rooms/${chatId}/lastMessage`]={
        ...messages[messages.length-2],
        // also need to show the message id below
        msgId:messages[messages.length-2].id
      }
    }
    if(isLast && messages.length===1){
      updates[`/rooms/${chatId}/lastMessage`]=null
    }

    try {
      await database.ref().update(updates);
      Alert.info('message deleted',4000);
    } catch (error) {
      // we return below so that when this try-catch doesn't works then the next one should also not execute
      // eslint-disable-next-line consistent-return
      return Alert.error(error.message,4000);
    }
    if(file){
      try {
        const fileRef=storage.refFromURL(file.url);
        // below is a promise
        await fileRef.delete()
      } catch (error) {
        Alert.error(error.message,4000)
      }
    }
  },[chatId,messages])

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>no messages yet</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
