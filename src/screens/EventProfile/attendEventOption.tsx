import {Actionsheet} from 'native-base';
import React from 'react';
import {EventStatus, INewEventData} from '../Events/types/EventInterfaces';
import {useEventEllipsisOptions} from './Queries/useEventEllipsisOptions';
import {useEventOperations} from './Queries/useEventOperations';

interface IAttendEventOption {
  isOpen: boolean;
  onClose: () => void;
  profile: INewEventData;
  status: string;
  EventId: string;
  isMember: boolean;
  responseStatus: string;
  from?: string;
}

function AttendEventOption(props: IAttendEventOption) {
  const {isOpen, onClose, profile, from, status, EventId, isMember, responseStatus} = props;
  const {sendAttendAction} = useEventOperations();
  const {handleReActivateEvent} = useEventEllipsisOptions();

  const handleSendRequestToAttend = () => {
    sendAttendAction(profile?.id, isMember, 'attending', from);
    onClose();
  };

  const handleMaybeAttend = () => {
    sendAttendAction(profile?.id, isMember, 'maybe', from);
    onClose();
  };

  const handleNotAttend = () => {
    sendAttendAction(profile?.id, isMember, 'not_attending', from);
    onClose();
  };
  const reActivateEvent = () => {
    handleReActivateEvent(EventId);
    onClose();
  };
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        {profile?.requireAttendeeApproval && !isMember ? (
          <>
            <Actionsheet.Item onPress={handleSendRequestToAttend}>
              Send Request To Attend
            </Actionsheet.Item>
            <Actionsheet.Item onPress={handleMaybeAttend}>Maybe</Actionsheet.Item>
            <Actionsheet.Item onPress={handleNotAttend}>Not Attending</Actionsheet.Item>
          </>
        ) : (
          !isMember && (
            <>
              <Actionsheet.Item onPress={handleSendRequestToAttend}>Attending</Actionsheet.Item>
              <Actionsheet.Item onPress={handleMaybeAttend}>Maybe</Actionsheet.Item>
              <Actionsheet.Item onPress={handleNotAttend}>Not Attending</Actionsheet.Item>
            </>
          )
        )}
        {responseStatus === 'attending' && (
          <>
            <Actionsheet.Item onPress={handleMaybeAttend}>Maybe</Actionsheet.Item>
            <Actionsheet.Item onPress={handleNotAttend}>Not Attending</Actionsheet.Item>
          </>
        )}
        {responseStatus === 'not_attending' && (
          <>
            <Actionsheet.Item onPress={handleSendRequestToAttend}>Attending</Actionsheet.Item>
            <Actionsheet.Item onPress={handleMaybeAttend}>Maybe</Actionsheet.Item>
          </>
        )}
        {responseStatus === 'maybe' && (
          <>
            <Actionsheet.Item onPress={handleSendRequestToAttend}>Attending</Actionsheet.Item>
            <Actionsheet.Item onPress={handleNotAttend}>Not Attending</Actionsheet.Item>
          </>
        )}
      </Actionsheet.Content>
    </Actionsheet>
  );
}

AttendEventOption.defaultProps = {
  from: '',
};

export default AttendEventOption;
