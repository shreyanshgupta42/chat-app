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
