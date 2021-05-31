/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModelState } from '../../misc/custom-hooks';

const fileInputTypes = '.png, .jpeg, .jpg';
const acceptedfiletypes = ['image/png', 'image/jpeg', 'image/pjpeg'];
const isValidFile = file => acceptedfiletypes.includes(file.type);
const AvatarUploadBtn = () => {
  const {isOpen,open,  close} = useModelState();
  const [img, setImg] = useState(null);
  const onfileInputChange = ev => {
    const currfiles = ev.target.files;
    if (currfiles.length === 1) {
      const file = currfiles[0];
      if (isValidFile(file)) {
        setImg(file);
        open()
      } else {
        Alert.warning('you selected the wrong file', 4000);
      }
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
                <div className='d-flex justify-content-center align-items-center h-100'>

              <AvatarEditor
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
            <Button block appearance="ghost">
              upload new avator
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
