import {Text, useDisclose} from 'native-base';
import React from 'react';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {useEventOperations} from './useEventOperations';

const useEventEllipsisOptions = () => {
  const sheetActions = useDisclose();
  const confirm = useConfirmModal();

  const {eventCancel, eventDeactivate, eventReactivate} = useEventOperations();

  const handleCancelEvent = (eventId: string,eventTitle: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Cancel Event</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to cancel the event </Text>
          <Title> {eventTitle}</Title>?
        </Text>
      ),
      onConfirm: () => {
        eventCancel(eventId);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };

  const handleDeActivateEvent = (eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Deactivate Event</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to Deactivate your Event?</Text>
        </Text>
      ),
      onConfirm: () => {
        eventDeactivate(eventId);
      },
      submitLabel: 'Confirm',
      cancelLabel: 'Cancel',
    });
  };
  const handleReActivateEvent = (eventId: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Reactivate Event</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to reactivate the event?</Text>
        </Text>
      ),
      onConfirm: () => {
        eventReactivate(eventId);
      },
      submitLabel: 'Reactivate',
      cancelLabel: 'Cancel',
    });
  };

  return {
    ...sheetActions,
    handleCancelEvent,
    handleDeActivateEvent,
    handleReActivateEvent,
  };
};

export {useEventEllipsisOptions};
