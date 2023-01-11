import React from 'react';
import {Button, Modal, VStack, HStack, Text} from 'native-base';

type IProps = {
  open: boolean;
  message: JSX.Element | undefined;
  title: JSX.Element | undefined;
  submitLabel: string;
  cancelLabel: string;
  handleCancel: () => void;
  handleConfirm: () => void;
  handleClose: () => void;
};

function CustomConfirmModal(props: IProps) {
  const {open, message, title, submitLabel, cancelLabel, handleCancel, handleClose, handleConfirm} = props;


  return (
    <Modal isOpen={open} size="lg" onClose={handleClose}>
      <Modal.Content maxWidth="350">
        {title && (
          <>
            <Modal.CloseButton onPress={handleClose} />
            <Modal.Header>{title}</Modal.Header>
          </>
        )}

        <Modal.Body>
          <VStack pt={!title ? 3 : 0} space={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">{message}</Text>
            </HStack>
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group>
            <Button colorScheme="blueGray" variant="ghost" onPress={handleCancel}>
              {cancelLabel}
            </Button>
            <Button onPress={handleConfirm}>{submitLabel}</Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default CustomConfirmModal;
