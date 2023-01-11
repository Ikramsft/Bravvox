import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {theme} from '../../theme';
import {EventRoles, EventStatus} from '../Events/types/EventInterfaces';
import InviteMember, {PickerHandle} from './InviteMember/InviteMember';
import {useEventEllipsisOptions} from './Queries/useEventEllipsisOptions';

interface IEventEllipseProps {
  eventId: string;
  eventTitle: string;
  isOpen: boolean;
  role: string;
  isPrivate: boolean;
  status: string;
  onClose: () => void;
  handleEditPress: () => void;
  onManageRoles: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const {OWNER, ADMIN} = EventRoles;
const {DEACTIVATED} = EventStatus;

const EventEllipseOptions = forwardRef<IPressHandler, IEventEllipseProps>(
  (props: IEventEllipseProps, ref) => {
    const {
      eventTitle,
      eventId,
      onClose,
      role,
      isOpen,
      status,
      isPrivate,
      onManageRoles,
      handleEditPress,
    } = props;
    const {handleCancelEvent, handleDeActivateEvent} = useEventEllipsisOptions();
    const {Content} = Actionsheet;
    const {Item} = Actionsheet;

    const inviteMember = React.useRef<PickerHandle>(null);

    const cancelEvent = () => {
      onClose();
      handleCancelEvent(eventId, eventTitle);
    };

    const deActivateEvent = () => {
      onClose();
      handleDeActivateEvent(eventId);
    };
    const handleOnManage = () => {
      onClose();
      onManageRoles();
    };

    const onEditPress = () => {
      onClose();
      handleEditPress();
    };

    const onHandleManageRole = () => {
      onClose();
      onManageRoles();
    };

    const openInvitemember = () => {
      onClose();
      if (inviteMember?.current) {
        inviteMember?.current?.onPickerSelect();
      }
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Content>
            {isPrivate && (role === OWNER || role === ADMIN) ? (
              <Item py="3" onPress={openInvitemember}>
                Invite
              </Item>
            ) : (
              <Item py="3" onPress={openInvitemember}>
                Invite
              </Item>
            )}
            {role === OWNER && (
              <>
                <Item py="3" onPress={onEditPress}>
                  Edit Event
                </Item>
                <Item py="3" onPress={onHandleManageRole}>
                  Manage Roles
                </Item>
                <Item py="3" onPress={cancelEvent}>
                  Cancel Event
                </Item>
              </>
            )}
            {status === DEACTIVATED ? (
              <Item
                _text={{
                  color: theme.colors.gray[500],
                }}
                onPress={onClose}>
                Mute Event Activity
              </Item>
            ) : (
              <Item py="3" onPress={onClose}>
                Mute Event Activity
              </Item>
            )}

            {(role === OWNER || role === ADMIN) && (
              <Item py="3" onPress={deActivateEvent}>
                De-activate Event
              </Item>
            )}
          </Content>
        </Actionsheet>
        <InviteMember from='event' id={eventId} ref={inviteMember} />
      </View>
    );
  },
);

export type EventEllipseOptionsHandle = React.ElementRef<typeof EventEllipseOptions>;
export default EventEllipseOptions;
