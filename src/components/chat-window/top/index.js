/* eslint-disable arrow-body-style */
import React,{memo} from 'react'
import { useCurrentRoom } from '../../../context/current-room.context';

// when description is change in data then below will not be rerendered because of memo(memo compares the value change if values changes than only rerenders) , thus only rerenders when name changes
const Top = () => {
    const name=useCurrentRoom(v=>v.name);
    return (
        <div>
            {name}
        </div>
    )
}

export default memo(Top)
