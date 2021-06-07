/* eslint-disable arrow-body-style */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { groupBy, transformToArrWithId } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const PAGE_SIZE = 15;
// by writing below we don't need to define dependency of messageRef for useEffect and useCallback, etc because messageRef became global
// reference to the messages section in database
const messagesRef = database.ref('/messages');

function shouldScrollToBottom(node,threshold=30){
  const percentage=(100*node.scrollTop)/(node.scrollHeight-node.clientHeight)||0
  return percentage>threshold
}

const Messages = () => {

  const [messages, setMessages] = useState(null);
  const { chatId } = useParams();
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node=selfRef.current

      // to subscribe to the new messages updates we have to unsubscribe to the old messages updates
      messagesRef.off();
    
      //  below is a realtime subscription
      messagesRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || PAGE_SIZE)
        .on('value', snap => {
          const data = transformToArrWithId(snap.val());
          setMessages(data);
          if(shouldScrollToBottom(node)){
            node.scrollTop=node.scrollHeight
          }
        });
      setLimit(p => p + PAGE_SIZE);
    },
    [chatId]
  );

  const loadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    //  below to again convert it into an aync task we put it in setTimeout and ensure it to run after loadMessages(limit)
    setTimeout(() => {
      const newHeight = node.scrollHeight;

      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    // when component has mounted
    const node = selfRef.current;

    loadMessages();

    // we set it under setTimeout to convert it into async task so that it is always executed after loadMessages() (and this all elements that we are trying to display are displayed) which is also a async operation
    setTimeout(() => {
      // below we will be scrolled to bottom
      node.scrollTop = node.scrollHeight;
    }, 200);
    // dismounting time
    return () => {
      // unsubscribe to the subcribed item which is neccessary
      messagesRef.off('value');
    };
  }, [loadMessages]);

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
    const { uid } = auth.currentUser;
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

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Delete this message?')) {
        return;
      }
      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};

      updates[`/messages/${msgId}`] = null;
      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          // also need to show the message id below
          msgId: messages[messages.length - 2].id,
        };
      }
      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.info('message deleted', 4000);
      } catch (error) {
        // we return below so that when this try-catch doesn't works then the next one should also not execute
        // eslint-disable-next-line consistent-return
        return Alert.error(error.message, 4000);
      }
      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          // below is a promise
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message, 4000);
        }
      }
    },
    [chatId, messages]
  );

  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );
    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center mb-1 padded">
          {date}
        </li>
      );
      const msgs = groups[date].map(msg => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));
      //  we use ...msgs to push a list of msgs
      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={loadMore} color="green">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>no messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
