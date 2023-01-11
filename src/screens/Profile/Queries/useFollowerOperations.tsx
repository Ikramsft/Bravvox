import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {truncateUsername} from '../../../utils';

const useFollowerOperations = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();

  const handleBlock = (id: string, userName: string | undefined) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Block User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to block </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleUnBlock = (userName: string | undefined) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unblock User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unblock </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleApprove = (userName: string | undefined) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Approve User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to approve </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      submitLabel: 'Approve',
      cancelLabel: 'Reject',
    });
  };

  const handleReject = (userName: string | undefined) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reject User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reject </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  return {
    ...sheetActions,
    handleApprove,
    handleReject,
    handleBlock,
    handleUnBlock,
  };
};

export {useFollowerOperations};
