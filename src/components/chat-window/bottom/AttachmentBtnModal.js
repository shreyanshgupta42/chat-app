/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttachmentBtnModal = ({afterUplaod}) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModelState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const onChange = fileArr => {
    const filtered = fileArr
      .filter(file => file.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);
    setFileList(filtered);
  };

  const onUpload =async () => {
    try {
      //   provides the array of promises below of all atonce selected files
      const uploadPromises = fileList.map(file => {
        //   Date.now()+file.name is used as the name in storage where we store this files because if make it a unique name
         return storage
          .ref(`/chat/${chatId}`)
          .child(Date.now() + file.name)
          .put(file.blobFile, {
            //   cachecontrol is to cache file in browser storage here for 3 days
            cacheControl: `public,max-age=${3600 * 24 * 3}`,
          });
      });

    //   resolving all promises
    //  it will resolve promises and uplaod the files and will give a uploaded snapshot in return 
      const uplaodSnapshots=await Promise.all(uploadPromises) 
    //   below is the files public available download url and it is also a promise therefore we again use a array of promises and the return of those promises we will store in our databasee
    const shapePromises=uplaodSnapshots.map(async (snap)=>{
        return {
            contentType:snap.metadata.contentType,
            name:snap.metadata.name,
            url:await snap.ref.getDownloadURL()
        }
    })
    const files=await Promise.all(shapePromises)

    // below will uplaod the files to database
    await afterUplaod(files);
    setIsLoading(false)
    close()
    } catch (error) {
        setIsLoading(false)
        Alert.error(error.message,4000)
    }
  };

  return (
    // we use reactFragment tag below because inputGoup will not work with div tag
    <>
      {/* we use here input group because its parents has inputGroup */}
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>Upload Files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            // below onChange is a property of Uploader component which return a list of files
            onChange={onChange}
            // able to uplaod multiple files
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button block disabled={isLoading} onClick={onUpload}>
            Send to Chat
          </Button>
          <div className="text-right mt-2">
            <small>*only files less than 5MB are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
