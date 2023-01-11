import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {truncateUsername} from '../../../utils';
import {MemberShipStatus} from '../../../utils/types';
import {ACTIONFROM, useGroupMember} from './useGroupMember';

const useMemberOperations = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();
  const {handleBlockUnBlockMember, handleMemberRequest} = useGroupMember();

  const handleBlock = (
    id: string,
    memberId: string | undefined,
    userName: string | undefined,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Block User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to block </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: () => {
        handleBlockUnBlockMember(id, memberId, 'block', navId, from);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleUnBlock = (
    id: string,
    memberId: string | undefined,
    userName: string | undefined,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unblock User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unblock </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: () => {
        handleBlockUnBlockMember(id, memberId, 'unblock', navId, from);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleApprove = (
    id: string,
    memberId: string | undefined,
    userId: string | undefined,
    userName: string | undefined,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Approve User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to approve </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: () => {
        handleMemberRequest(id, memberId, userId, 'approve', navId, from);
      },
      onCancel: () => {
        handleReject(id, memberId, userId, userName, navId, from);
      },

      submitLabel: 'Approve',
      cancelLabel: 'Reject',
    });
  };

  const handleReject = (
    id: string,
    memberId: string | undefined,
    userId: string | undefined,
    userName: string | undefined,
    navId: MemberShipStatus,
    from: ACTIONFROM,
  ) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reject User</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reject </Text>
          <Title>@{truncateUsername(userName)} </Title>?
        </Text>
      ),
      onConfirm: () => {
        handleMemberRequest(id, memberId, userId, 'reject', navId, from);
      },
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

export {useMemberOperations};
