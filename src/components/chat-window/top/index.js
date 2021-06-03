/* eslint-disable arrow-body-style */
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useCurrentRoom } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import RoomInfoBtnModal from './RoomInfoBtnModal';

// when description is change in data then below will not be rerendered because of memo(memo compares the value change if values changes than only rerenders) , thus only rerenders when name changes
const Top = () => {
  const name = useCurrentRoom(v => v.name);
  const isMobile = useMediaQuery('(max-width:992px)');
  return (
    <div>
      <div className="d-flex justify-content-between text-align-center">
          {/* text-disappear prevents text overflow when text is too long  */}
        <h4 className='text-disappear d-flex align-items-center'>
          {/* by componentClass={Link} we wil make Icon clickabe and will lead to a link provided in to property */}
          <Icon
            componentClass={Link}
            to="/"
            icon="arrow-circle-left"
            size="2x"
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          />
          <span className="text-disappear">{name}</span>
        </h4>
        <ButtonToolbar className='ws-nowrap'>todo</ButtonToolbar>
      </div>
      <div className='d-flex justify-content-between align-items-center'>
          <span>todo</span>
          <RoomInfoBtnModal/>
      </div>
    </div>
  );
};

export default memo(Top);
