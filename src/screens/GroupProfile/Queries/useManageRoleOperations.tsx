/**
 * @format
 */
import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {ACTIONFROM} from './useGroupMember';
import {useManageRoles} from './useManageRoles';

const useManageRoleOperations = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();
  const {handleMakeAdminActivity, handleRemoveAdminActivity} = useManageRoles();

  const handleMakeOwner = (id: string, memberId: string | undefined, from: ACTIONFROM) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Transfer Ownership</Title>,
      message: (
        <Text>
          <Text>
            {from === 'group'
              ? 'Are you sure, you want to remove yourself as group owner? You will no longer have access to this screen.'
              : from === 'event'
              ? 'Are you sure you want to remove yourself as event owner? You will no longer have access to this screen.'
              : 'Are you sure you want to remove yourself as business page owner? You will no longer have access to this screen.'}
          </Text>
        </Text>
      ),
      onConfirm: () => {
        handleMakeAdminActivity(id, memberId, from);
      },
      submitLabel: 'Yes',
      cancelLabel: 'No',
    });
  };

  const handleRemoveAdmin = (id: string, memberId: string | undefined, from: ACTIONFROM) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Remove Admin</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to remove admin role for this member?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleRemoveAdminActivity(id, memberId, from);
      },
      submitLabel: 'Yes',
      cancelLabel: 'No',
    });
  };

  return {
    ...sheetActions,
    handleMakeOwner,
    handleRemoveAdmin,
  };
};

export {useManageRoleOperations};
