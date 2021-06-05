/* eslint-disable arrow-body-style */
import React from 'react';
import { Badge, Icon, IconButton, Tooltip, Whisper } from 'rsuite';

const ConditionalBadge=({condition,children})=>{
    return condition?<Badge content={condition}>{children}</Badge>:children;
}

const IconBtnControl = ({
  isVisible,
  iconName,
  tooltip,
  onClick,
  badgeContent,
  ...props
}) => {
  return (
    <div
      className="ml-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      {/* below is the typical conditional rendering with the use of component ConditionalBadge created at the top */}
      <ConditionalBadge condition={badgeContent}>
          <Whisper
            placement='top'
            delay={0}
            delayHide={0}
            delayShow={0}
            trigger={0}
            speaker={<Tooltip>{tooltip}</Tooltip>}
          >
              <IconButton 
                {...props}
                onClick={onClick}
                circle
                size='xs'
                icon={<Icon icon={iconName}/>}
              />

          </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default IconBtnControl;
