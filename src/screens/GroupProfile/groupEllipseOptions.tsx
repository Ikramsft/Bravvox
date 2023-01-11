import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {theme} from '../../theme';
import {GroupRoles, GroupStatus} from '../Groups/types/GroupInterfaces';
import {IResponseData} from './Queries/useGroupMemberCheck';
import {useGroupOperations} from './Queries/useGroupOperations';
import InviteMember, {PickerHandle} from '../EventProfile/InviteMember/InviteMember';

interface IGroupEllipseProps {
  dataMember: IResponseData | undefined;
  groupId: string;
  isOpen: boolean;
  role: string;
  status: string;
  onClose: () => void;
  onEdit: () => void;
  onManageRoles: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

const {OWNER, ADMIN} = GroupRoles;
const {DEACTIVATED} = GroupStatus;
const GroupEllipseOptions = forwardRef<IPressHandler, IGroupEllipseProps>(
  (props: IGroupEllipseProps, ref) => {
    const {dataMember, groupId, onClose, role, isOpen, status, onEdit, onManageRoles} = props;
    const {handleLeaveGroup, handleDeActivateGroup, handleReActivateGroup} = useGroupOperations();
    const inviteMember = React.useRef<PickerHandle>(null);

    const onClickLeave = () => {
      onClose();
      handleLeaveGroup(groupId, dataMember?.data?.id);
    };

    const onClickDeActivate = () => {
      onClose();
      handleDeActivateGroup(groupId);
    };

    const onClickReActivate = () => {
      onClose();
      handleReActivateGroup(groupId);
    };

    const onEditPress = () => {
      onClose();
      onEdit();
    };

    const openManageRoles = () => {
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
          <Actionsheet.Content>
            {role === OWNER || role === ADMIN ? (
              <Actionsheet.Item py="3" onPress={openInvitemember}>
                Invite
              </Actionsheet.Item>
            ) : null}

            {role === OWNER && (
              <>
                <Actionsheet.Item py="3" onPress={onEditPress}>
                  Edit Group
                </Actionsheet.Item>
                <Actionsheet.Item py="3" onPress={openManageRoles}>
                  Manage Roles
                </Actionsheet.Item>
              </>
            )}
            {status === DEACTIVATED ? (
              <Actionsheet.Item
                _text={{
                  color: theme.colors.gray[500],
                }}
                onPress={onClose}>
                Mute Group Activity
              </Actionsheet.Item>
            ) : (
              <Actionsheet.Item py="3" onPress={onClose}>
                Mute Group Activity
              </Actionsheet.Item>
            )}

            {role === OWNER || status === DEACTIVATED ? (
              <Actionsheet.Item
                _text={{
                  color: theme.colors.gray[500],
                }}
                py="3"
                onPress={onClose}>
                Leave Group
              </Actionsheet.Item>
            ) : (
              <Actionsheet.Item py="3" onPress={onClickLeave}>
                Leave Group
              </Actionsheet.Item>
            )}
            {(role === OWNER || role === ADMIN) && (
              <Actionsheet.Item py="3" onPress={onClickDeActivate}>
                De-activate Group
              </Actionsheet.Item>
            )}
            {status === DEACTIVATED && (
              <Actionsheet.Item py="3" onPress={onClickReActivate}>
                Reactivate Group
              </Actionsheet.Item>
            )}
          </Actionsheet.Content>
        </Actionsheet>
        <InviteMember from="group" id={groupId} ref={inviteMember} />
      </View>
    );
  },
);

export type GroupEllipseOptionsHandle = React.ElementRef<typeof GroupEllipseOptions>;
export default GroupEllipseOptions;
