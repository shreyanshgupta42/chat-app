/* eslint-disable arrow-body-style */
import React, { useRef, useState } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModelState } from '../../misc/custom-hooks';
import { database, storage } from '../../misc/firebase';
import { useProfile } from '../../context/profile.context';

const fileInputTypes = '.png, .jpeg, .jpg';
const acceptedfiletypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => acceptedfiletypes.includes(file.type);
const getBlob = canvas => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('file process error'));
      }
    });
  });
};
const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModelState();
  const { profile } = useProfile();
  const [img, setImg] = useState(null);
  const avatarEditorRef = useRef();
  const [isloading, setIsLoading] = useState(false);
  const onfileInputChange = ev => {
    const currfiles = ev.target.files;
    if (currfiles.length === 1) {
      const file = currfiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        Alert.warning('you selected the wrong file', 4000);
      }
    }
  };
  const onUploadClick = async () => {
    // we use current below because we want the current element form avatarEditorRef and it can also be undefined, and the function getImageScaledToCanvas comes from the documentation of avatar editor
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();
    setIsLoading(true);
    try {
      const blob = await getBlob(canvas);
      // below is file to store image in firebase
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');
      const uploadAvatarResult = await avatarFileRef.put(blob, {
        cacheControl: `public,max-age=${3600 * 24 * 3}`,
      });
      const downloadUrl = await uploadAvatarResult.ref.getDownloadURL();
      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');
      await userAvatarRef.set(downloadUrl);
      setIsLoading(false);
      Alert.info('avatar has been uploaded', 4000);
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <div>
        {/* for label error is there which says label must be there with some control so we put htmlfor */}
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new Avatar
          {/* d-block is display block and d-none is display none */}
          <input
            id="avatar-upload"
            type="file"
            className="d-none"
            accept={fileInputTypes}
            onChange={onfileInputChange}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Title>Adjust and upload new avatar</Modal.Title>
          <Modal.Body>
            {img && (
              <div className="d-flex justify-content-center align-items-center h-100">
                {/* below edits the image to requirement */}
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isloading}
            >
              upload new avator
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
