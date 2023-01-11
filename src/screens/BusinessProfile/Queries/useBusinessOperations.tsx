import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {useBusinessEllipsesMenu} from './useBusinessEllipsesMenu';
import {useBusinessMember} from './useBusinessMember';

const useBusinessOperations = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();
  
  const {handleDeactiveBusinessActivity, handleReactiveBusinessActivity} =
    useBusinessEllipsesMenu();

  const {handleLeaveBusinessActivity} = useBusinessMember();

  const handleDeActivateBusiness = (businessId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>De-activate Business</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to de-activate your business?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleDeactiveBusinessActivity(businessId);
      },
      submitLabel: 'De-activate',
      cancelLabel: 'No',
    });
  };

  const handleLeaveBusiness = (businessId: string, id: string | undefined) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Unfollow Business Page</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to unfollow the business page?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleLeaveBusinessActivity(businessId, id);
      },
      submitLabel: 'Yes',
      cancelLabel: 'No',
    });
  };

  const handleReActivateBusiness = (businessId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reactivate Business</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reactivate your business?</Text>
        </Text>
      ),
      onConfirm: () => {
        handleReactiveBusinessActivity(businessId);
      },
      submitLabel: 'Reactivate',
      cancelLabel: 'No',
    });
  };

  return {
    ...sheetActions,
    handleDeActivateBusiness,
    handleReActivateBusiness,
    handleLeaveBusiness,
  };
};

export {useBusinessOperations};
