import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {RelationShip} from '../../redux/reducers/user/UserInterface';
import {useProfileOperations} from './Queries/useProfileOperations';

interface IMemberProps {
  userId: string;
  userName: string;
  isOpen: boolean;
  relationship: RelationShip;
  onClose: () => void;
}

type IPressHandler = {
  onPickerSelect: () => void;
};
export enum FollowerTypes {
  FOLLOW = 'Follow',
  UNFOLLOW = 'Unfollow',
  CANCEL_REQUEST = 'Cancel Request',
  FOLLOW_BACK = 'Follow Back',
  APPROVE_FOLLOWER = 'Approve Request',
  UNBLOCK = 'Unblock',
}
const {FOLLOW, UNFOLLOW, CANCEL_REQUEST, FOLLOW_BACK, APPROVE_FOLLOWER, UNBLOCK} = FollowerTypes;
const ProfileEllipseOptions = forwardRef<IPressHandler, IMemberProps>(
  (props: IMemberProps, ref) => {
    const {onClose, isOpen, relationship, userId, userName} = props;
    const {
      handleFollow,
      handleCancel,
      handleUnfollow,
      handleApprove,
      handleFollowBackUser,
      handleUnBlock,
      handleBlock,
    } = useProfileOperations();
    const {Content} = Actionsheet;
    const {Item} = Actionsheet;

    const handleBlockUser = () => {
      handleBlock(userId, userName);
      onClose();
    };
    const cancelRequest = () => {
      handleCancel(userId, userName);
      onClose();
    };

    const followUser = () => {
      handleFollow(userId, userName);
      onClose();
    };

    const unBlockUser = () => {
      handleUnBlock(userId, userName);
      onClose();
    };

    const unFollowUser = () => {
      handleUnfollow(userId, userName);
      onClose();
    };

    const ApproveUser = () => {
      handleApprove(userId, userName, 'profile');
      onClose();
    };

    const FollowBack = () => {
      handleFollowBackUser(userId, userName);
      onClose();
    };

    function renderOptions(option: RelationShip) {
      switch (option?.toLowerCase()) {
        case 'requested':
          return (
            <Item py="3" onPress={cancelRequest}>
              {CANCEL_REQUEST}
            </Item>
          );
        case 'none':
        case 'follow':
          return (
            <Item py="3" onPress={followUser}>
              {FOLLOW}
            </Item>
          );
        case 'following':
        case 'following me':
        case 'unfollow':
          return (
            <>
              <Item py="3" onPress={unFollowUser}>
                {UNFOLLOW}
              </Item>
              <Item py="3" onPress={handleBlockUser}>
                Block
              </Item>
            </>
          );
        case 'follower':
        case 'follow back':
          return (
            <Item py="3" onPress={FollowBack}>
              {FOLLOW_BACK}
            </Item>
          );
        case 'approve follower':
          return (
            <Item py="3" onPress={ApproveUser}>
              {APPROVE_FOLLOWER}
            </Item>
          );
        case 'unblock':
          return (
            <Item py="3" onPress={unBlockUser}>
              {UNBLOCK}
            </Item>
          );
        default:
          return null;
      }
    }
    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Content>
            {renderOptions(relationship)}
            {/* <Item py="3" onPress={onClose}>
              Block
            </Item> */}
          </Content>
        </Actionsheet>
      </View>
    );
  },
);

export type MemberEllipseOptionsHandle = React.ElementRef<typeof ProfileEllipseOptions>;
export default ProfileEllipseOptions;
