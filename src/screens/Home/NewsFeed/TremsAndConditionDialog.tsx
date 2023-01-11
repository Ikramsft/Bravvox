import {Button, Modal, Radio, Text} from 'native-base';
import React, {useEffect, useState} from 'react';

interface ITermsAndCondition {
  open: boolean;
  body: string;
  handleClose: () => void;
}

function TermsAndConditionDialog(props: ITermsAndCondition) {
  const {open, handleClose, body} = props;

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Terms & Conditions</Modal.Header>
        <Modal.Body>
          <Text>{body}</Text>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}

export default TermsAndConditionDialog;
