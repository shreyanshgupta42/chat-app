/* eslint-disable arrow-body-style */
import React,{createContext, useContext, useEffect, useState} from 'react'
import { database } from '../misc/firebase';
import { transformToArrWithId } from '../misc/helpers';

const RoomsContext=createContext();

export const RoomsProvider=({children})=>{

    const [rooms,setRooms ]=useState(null);

    useEffect(()=>{
        // below we get the reference from the database to the rooms data
        const roomListRef=database.ref('rooms');

        // below is the realtime listener
        roomListRef.on('value',(snap)=>{
            const data=transformToArrWithId(snap.val());
            setRooms(data);
        })
        // below is during unmount
        return ()=>{
            // unsubscribe
            roomListRef.off()

        }
    })
    return <RoomsContext.Provider value={rooms}>
        {children}
    </RoomsContext.Provider>
}

export const useRooms =()=>useContext(RoomsContext)