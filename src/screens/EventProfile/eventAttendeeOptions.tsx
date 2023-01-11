import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {useAttendeeOperations} from './Queries/useAttendeeOperations';
import {AttendeeFilter, EventAttendeeUserData} from './Queries/useAttendees';

interface IEventAttendeeEllipsProps {
  member: EventAttendeeUserData | undefined;
  eventId: string;
  isOpen: boolean;
  filter: AttendeeFilter;
  // documentId: string;
  onClose: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const EventAttendeeEllipseOptions = forwardRef<IPressHandler, IEventAttendeeEllipsProps>(
  (props: IEventAttendeeEllipsProps, ref) => {
    const {member, eventId, onClose, isOpen, filter} = props;
    const {handleApprove, handleReject, handleBlock, handleUnblock} = useAttendeeOperations(filter);
    const {Content} = Actionsheet;
    const {Item} = Actionsheet;

    if (!member) {
      return null;
    }

    const approveAttendee = () => {
      onClose();
      handleApprove(member?.user_id, member?.userName, eventId);
    };

    const rejectAttendee = () => {
      onClose();
      handleReject(member?.user_id, member?.userName, eventId);
    };

    const blockAttendee = () => {
      onClose();
      handleBlock(member?.id, member?.userName, eventId);
    };

    const reportAbuse = () => {
      onClose();
    };

    const unblock = () => {
      onClose();
      handleUnblock(member?.id, member?.userName, eventId);
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Content>
            {member?.status === 'pending' && (
              <>
                <Item py="3" onPress={approveAttendee}>
                  Approve Attendee
                </Item>
                <Item py="3" onPress={rejectAttendee}>
                  Reject Attendee
                </Item>
              </>
            )}

            {member?.status === 'accepted' && (
              <Item py="3" onPress={blockAttendee}>
                Block Attendee
              </Item>
            )}

            {member?.status === 'blocked' && (
              <Item py="3" onPress={unblock}>
                Unblock
              </Item>
            )}

            <Item py="3" onPress={reportAbuse}>
              Report Abuse
            </Item>
          </Content>
        </Actionsheet>
      </View>
    );
  },
);

export type EventAttendeeEllipseOptionsHandle = React.ElementRef<
  typeof EventAttendeeEllipseOptions
>;
export default EventAttendeeEllipseOptions;
