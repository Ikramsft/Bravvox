import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {
  GroupMemberStatus,
  GroupRoles,
  IMembersData,
  MemberActionTypes,
} from '../Groups/types/GroupInterfaces';
import {ACTIONFROM, MemberShipStatus} from './Queries/useGroupMember';
import {useMemberOperations} from './Queries/useMemberOperations';

interface IMemberProps {
  member: IMembersData | undefined;
  id?: string; // This can be groupId, businessId, eventId in future
  role: string | undefined;
  documentId: string;
  isOpen: boolean;
  onClose: () => void;
  navId: MemberShipStatus;
  from: ACTIONFROM;
}

type IPressHandler = {
  onPickerSelect: () => void;
};
const {CANCEL_REQUEST, APPROVE_MEMBER, REJECT_MEMBER, BLOCK, UNBLOCK, REPORT_ABUSE} =
  MemberActionTypes;
const {ACCEPTED, INVITED, PENDING, BLOCKED} = GroupMemberStatus;
const {OWNER, ADMIN} = GroupRoles;

const MemberEllipseOptions = forwardRef<IPressHandler, IMemberProps>((props: IMemberProps, ref) => {
  const {member, id = '', role, from, onClose, isOpen, documentId, navId} = props;
  const {handleBlock, handleUnBlock, handleApprove, handleReject} = useMemberOperations();

  const onClickBlock = () => {
    onClose();
    handleBlock(id, member?.id, member?.userName, navId, from);
  };

  const onClickUnBlock = () => {
    onClose();
    handleUnBlock(id, member?.id, member?.userName, navId, from);
  };

  const onClickMemberApprove = () => {
    onClose();
    handleApprove(id, member?.id, member?.user_id, member?.userName, navId, from);
  };

  const onClickMemberReject = () => {
    onClose();
    handleReject(id, member?.id, member?.user_id, member?.userName, navId, from);
  };

  const handleBlockOptions = () => {
    const arr = ['admin', 'owner'];
    if (member && member?.user_id !== documentId) {
      if (role === ADMIN && !arr.includes(member?.role)) {
        return (
          <Actionsheet.Item py="3" onPress={onClickBlock}>
            {BLOCK}
          </Actionsheet.Item>
        );
      }
      if (role === OWNER) {
        return (
          <Actionsheet.Item py="3" onPress={onClickBlock}>
            {BLOCK}
          </Actionsheet.Item>
        );
      }
    }
    return null;
  };

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        {member && (
          <Actionsheet.Content>
            {member.status === INVITED && (
              <Actionsheet.Item py="3" onPress={onClose}>
                {CANCEL_REQUEST}
              </Actionsheet.Item>
            )}
            {member.status === BLOCKED && (
              <Actionsheet.Item py="3" onPress={onClickUnBlock}>
                {UNBLOCK}
              </Actionsheet.Item>
            )}
            {member.status === PENDING && (
              <>
                <Actionsheet.Item py="3" onPress={onClickMemberApprove}>
                  {APPROVE_MEMBER}
                </Actionsheet.Item>
                <Actionsheet.Item py="3" onPress={onClickMemberReject}>
                  {REJECT_MEMBER}
                </Actionsheet.Item>
              </>
            )}
            {member.status === ACCEPTED && handleBlockOptions()}
            <Actionsheet.Item py="3" onPress={onClose}>
              {REPORT_ABUSE}
            </Actionsheet.Item>
          </Actionsheet.Content>
        )}
      </Actionsheet>
    </View>
  );
});

MemberEllipseOptions.defaultProps = {
  id: '',
};

export type MemberEllipseOptionsHandle = React.ElementRef<typeof MemberEllipseOptions>;
export default MemberEllipseOptions;
