/* eslint-disable arrow-body-style */
import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useHover, useMediaQuery } from '../../../misc/custom-hooks';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import IconBtnControl from './IconBtnControl';
import ImgBtnModal from './ImgBtnModal';
import ProfileInfoBtnModal from './ProfileInfoBtnModal';

const renderFileMessage=(file)=>{
  if(file.contentType.includes('image')){
    return <div className='height-220'>
      <ImgBtnModal src={file.url} filename={file.name} />
    </div>
  }
  return <a href={file.url}>Download {file.name}</a>
}

const MessageItem = ({ message, handleAdmin, handleLike,handleDelete }) => {
  const { author, createdAt, text,file, likes, likeCount } = message;
  const isMobile = useMediaQuery('(max-width:992px)');

  const [selfRef, isHovered] = useHover();
  const isAdmin = useCurrentRoom(v => v.isAdmin);
  const admins = useCurrentRoom(v => v.admins);

  const isMsgAuthorAdmin = admins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canShowIcon = isMobile || isHovered;

  // Object.keys(likes) provides the array of users who likes
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  const canGrantAdmin = isAdmin && !isAuthor;
  return (
    <li
      className={`padded mb-1 cursor-pointer ${isHovered ? 'bg-black-02' : ''}`}
      ref={selfRef}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearence="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAdmin && (
            <Button block onClick={() => handleAdmin(author.uid)} color="blue">
              {isMsgAuthorAdmin
                ? 'Remove Admin Permission'
                : 'Give admin in this room'}
            </Button>
          )}
        </ProfileInfoBtnModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <IconBtnControl
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={canShowIcon}
          iconName="heart"
          tooltip="Like this Message"
          onClick={() => {
            handleLike(message.id);
          }}
          badgeContent={likeCount}
        />
        {isAuthor && (
          <IconBtnControl
            isVisible={canShowIcon}
            iconName="close"
            tooltip="Delete this Message"
            onClick={() => {
              handleDelete(message.id);
            }}
          />
        )}
      </div>
      <div>
        {/* word-break-all prevents data overflow */}
        {text && 
        <span className="word-break-all">{text}</span>
        }
        {file && renderFileMessage(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
