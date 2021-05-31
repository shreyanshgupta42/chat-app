/* eslint-disable arrow-body-style */
import React, { useCallback, useState } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditableInput = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'write your value',
  Eptymsg = 'input is empty',
  ...inputProps
}) => {
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);
  // onchange of rsuite input component provide value instead of ev.target.value for onchange
  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEditable(p => !p);
    // below is just in case somebody cancels the editing then it will return to the initial value
    setInput(initialValue);
  }, [initialValue]);

  const onSaveClick = async () => {
    // to avoid unneccessary spaces we use trimmed values
    const trimmed = input.trim();

    if (trimmed === '') {
      Alert.info(Eptymsg, 4000);
    }
    if (trimmed !== initialValue) {
      // onSave and onSaveClick is async so we have to await it
      await onSave(trimmed);
    }
    setIsEditable(false);
  };
  return (
    <div>
      {label}
      {/* below input is rsuite input component */}
      <InputGroup>
        <Input
          {...inputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          // the placeholder overrides any placeholder inside input props
          value={input}
          onChange={onInputChange}
        />
        <InputGroup.Button onClick={onEditClick}>
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>
        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditableInput;
