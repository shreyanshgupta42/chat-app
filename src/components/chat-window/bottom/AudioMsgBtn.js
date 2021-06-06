/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react';
import { ReactMic } from 'react-mic';
import { useParams } from 'react-router';
import { Alert, Icon, InputGroup } from 'rsuite';
import { storage } from '../../../misc/firebase';

const AudioMsgBtn = ({ afterUpload }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUplaoding, setIsUplaoding] = useState(false);

  const { chatId } = useParams();
  const onClick = useCallback(() => {
    setIsRecording(p => !p);
  }, []);
  const onUplaod = useCallback(
    async data => {
      setIsUplaoding(true);
      try {
        const snap = await storage
          .ref(`/chat/${chatId}`)
          .child(`audio_${Date.now()}.mp3`)
          .put(data.blob, {
            //   cachecontrol is to cache file in browser storage here for 3 days
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          });

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
        setIsUplaoding(false);
        //   in afterUpload we need to pass a array, therefore we pass file as [file], which is a single element array
        afterUpload([file]);
      } catch (error) {
        setIsUplaoding(false);
        Alert.error(error.message, 4000);
      }
    },
    [afterUpload, chatId]
  );
  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUplaoding}
      className={isRecording ? 'animate-blink' : ''}
    >
      <Icon icon="microphone" />
      <ReactMic
        record={isRecording}
        className="d-none"
        // onStop gives us the recorded data
        onStop={onUplaod}
        strokeColor="#000000"
        // below to confirm that we receive mp3
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default AudioMsgBtn;
