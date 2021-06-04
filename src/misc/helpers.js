/* eslint-disable arrow-body-style */
export function getNameInitials(name) {
  const splitname = name.toUpperCase().split(' ');
  if (splitname.length > 1) {
    return splitname[0][0] + splitname[1][0];
  }
  return splitname[0][0];
}

export function transformToArrWithId(snapVal) {
  return snapVal
    ? Object.keys(snapVal).map(roomId => {
        return { ...snapVal[roomId], id: roomId };
      })
    : [];
}

export async function getUserUpdates(userId, keyToUpdate, value, db) {
  const updates = {};
  // below we are trying to update
  updates[`/profiles/${userId}/${keyToUpdate}`] = value;

  // references
  const getMsgs = db
    .ref('/messages')
    .orderByChild('author/uid')
    .equalTo(userId)                          // uid is matched to userId
    .once('value');
  const getRooms = db
    .ref('/rooms')
    .orderByChild('lastMessage/author/uid')
    .equalTo(userId)        
    .once('value');

  const [mSnap, rSnap] = await Promise.all([getMsgs, getRooms]); // will return snapshot of them

  mSnap.forEach(msgSnap => {
    updates[`/messages/${msgSnap.key}/author/${keyToUpdate}`] = value;
  });
  rSnap.forEach(roomSnap => {
    updates[`/rooms/${roomSnap.key}/lastMessage/author/${keyToUpdate}`] = value;
  });
  return updates;
}
