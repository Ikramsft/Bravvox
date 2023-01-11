/**
 * @format
 */
import {Button, Modal, Radio, Text, View} from 'native-base';
import React, {useEffect, useState} from 'react';
import {Title} from '../../../components/Typography';

const OPTIONS = [
  {
    value: 'everyone',
    label: 'Delete for Everyone',
    desc: 'The message will be deleted for everyone in the chat. Others may have alredy seen or Deleted messages can still be included in reports.',
  },
  {
    value: 'me',
    label: 'Delete for You',
    desc: 'This message will be removed for you. Others in the chat will still be able to see it.',
  },
];

interface IDeleteMessageDialog {
  open: boolean;
  handleClose: () => void;
  handleSubmit: (reason: string) => void;
  isLoading: boolean;
}

function DeleteMsgDialog(props: IDeleteMessageDialog) {
  const {open, handleClose, handleSubmit, isLoading} = props;

  const [value, setValue] = useState<string>('');
  const [option, setOption] = useState<string>('');

  useEffect(() => {
    setValue('everyone');
    setOption('');
  }, [open]);

  if (!open) {
    return null;
  }

  const onDeleteOptionChoose = () => {
    if (option === '') {
      setOption(value);
    } else {
      handleSubmit(value);
    }
  };

  const title =
    option === '' ? 'Who do you want to delete this message for?' : `Delete for ${option}`;

  const deleteMsg =
    option === 'me'
      ? 'This Message will be deleted for you. Other chat members will still be able to see it.'
      : 'This message will be deleted for everyone. Other chat members will also not able to see it.';

  const body =
    option === '' ? (
      <Radio.Group
        accessibilityLabel="delete for ?"
        ml={2}
        name="deleteOptions"
        value={value}
        onChange={setValue}>
        {OPTIONS.map(i => {
          return (
            <View alignItems="flex-start" flexDirection="row" key={i.value} mt={2}>
              <Radio
                accessibilityLabel={i.label}
                isDisabled={isLoading}
                key={i.value}
                value={i.value}
              />
              <View flex="0.8" flexGrow="1" ml={1}>
                <Title>{i.label}</Title>
                <Text mt={1}>{i.desc}</Text>
              </View>
            </View>
          );
        })}
      </Radio.Group>
    ) : (
      <Text>{deleteMsg}</Text>
    );

  return (
    <Modal isOpen={open} onClose={!isLoading && handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton isDisabled={isLoading} />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button
              colorScheme="blueGray"
              isDisabled={isLoading}
              variant="ghost"
              onPress={handleClose}>
              Cancel
            </Button>
            <Button
              isDisabled={!value || isLoading}
              isLoading={isLoading}
              isLoadingText="Deleting..."
              onPress={onDeleteOptionChoose}>
              Delete
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default DeleteMsgDialog;
