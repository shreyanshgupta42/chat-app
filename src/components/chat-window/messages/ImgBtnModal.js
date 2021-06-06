/* eslint-disable arrow-body-style */
import React from 'react'
import { Modal } from 'rsuite';
import { useModelState } from '../../../misc/custom-hooks'

const ImgBtnModal = ({src,filename}) => {
    const {isOpen,close,open}=useModelState();
    return (
        <>
        {/* type image makes the input act like a button */}
          <input type='image' src={src} alt='file' onClick={open} className="mw-100 mh-100 w-auto" />  
          <Modal show={isOpen} onHide={close}>
              <Modal.Header>
                  <Modal.Title>{filename}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <div>
                      <img src={src} height="100%" width="100%" alt="file" />
                  </div>
              </Modal.Body>
              <Modal.Footer>
                  <a href={src} target="_blank" rel="noopener noreferrer" >
                    View Original
                  </a>
              </Modal.Footer>
          </Modal>
        </>
    )
}

export default ImgBtnModal
