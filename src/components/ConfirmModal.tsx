import React, {useState} from 'react';
import {Button, Modal, VStack, HStack, Text} from 'native-base';

interface IConfirmProps{
    isOpen:boolean;
    toggle:()=>void;
    title:string;
    message:string;
}
function ConfirmModal(props:IConfirmProps) {
    const {isOpen,toggle,title,message} = props;
  return (
    <Modal isOpen={isOpen} size="lg" onClose={toggle}>
      <Modal.Content maxWidth="350">
        <Modal.CloseButton />
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <VStack space={3}>
            <HStack alignItems="center" justifyContent="space-between">
              <Text fontWeight="medium">{message}</Text>
              {/* <Text color="blueGray.400">$298.77</Text> */}
            </HStack>
           
            
          </VStack>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button
            flex="1"
            onPress={() => {
              //
            }}>
            Continue
          </Button> */}
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}

export default ConfirmModal;
