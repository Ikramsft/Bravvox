import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {useGroupMember} from './useGroupMember';

const useGroupOperations = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();
  const {handleLeaveGroupActivity, handleDeactiveGroupActivity, handleReactiveGroupActivity} =
    useGroupMember();

  const handleLeaveGroup = (groupId: string, id: string | undefined) => {
 
    confirm?.show?.({
      title: <Title fontSize={18}>Leave Group</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to leave your group?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleLeaveGroupActivity(groupId, id);
      },
      submitLabel: 'Yes',
      cancelLabel: 'No',
    });
  };

  const handleDeActivateGroup = (groupId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>De-activate Group</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to de-activate your group?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleDeactiveGroupActivity(groupId);
      },
      submitLabel: 'De-activate',
      cancelLabel: 'No',
    });
  };
  const handleReActivateGroup = (groupId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reactivate Group</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reactivate your group?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleReactiveGroupActivity(groupId);
      },
      submitLabel: 'Reactivate',
      cancelLabel: 'No',
    });
  };

  return {
    ...sheetActions,
    handleLeaveGroup,
    handleDeActivateGroup,
    handleReActivateGroup,
  };
};

export {useGroupOperations};
