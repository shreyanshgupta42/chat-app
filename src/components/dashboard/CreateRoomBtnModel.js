/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable arrow-body-style */
import firebase from 'firebase/app';
import React, { useCallback, useRef, useState } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import { useModelState } from '../../misc/custom-hooks';
import { database } from '../../misc/firebase';

const { StringType } = Schema.Types;

const model = Schema.Model({
  name: StringType().isRequired('Chat name is required'),
  description: StringType().isRequired('Description is required'),
});
const INITIAL_FORM = {
  name: '',
  description: '',
};

const CreateRoomBtnModel = () => {
  const { isOpen, open, close } = useModelState();
  const [formValue, setFormValue] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  //   this value is in the same format as the INITIAL_FORM object because rsuite forms provides in this way only
  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);
  const onSubmit = async () => {
    //   the check function isavaible in the form component of rsuite and will validate its data against the schema provided
    if (!formRef.current.check()) {
      return;
    }
    setIsLoading(true);
    const newRoomdata = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
    };
    try {
      await database.ref('/rooms').push(newRoomdata);
      Alert.info(`${formValue} has been created`, 4000);
      setIsLoading(false);
      setFormValue(INITIAL_FORM);
      close();
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <div className="mt-1">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" />
        Create new Chatroom
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Modal.Header>
          <Modal.Title>New Chatroom</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* fluid makes it take all space available in the raper element
          and below formValue gives us the formValue, by obtaining it from formValue variable of useState and updates it to the UI of the form in display */}
          <Form
            fluid
            onChange={onFormChange}
            formValue={formValue}
            model={model}
            ref={formRef}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chatroom name" />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter chatroom Description"
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create New Chatroom
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CreateRoomBtnModel;
