import {Actionsheet, View} from 'native-base';
import React, {forwardRef} from 'react';
import {FollowerUserData} from './Queries/useFollowers';
import {useProfileOperations} from './Queries/useProfileOperations';

interface IFollowerProps {
  isOpen: boolean;
  onClose: () => void;
  follower?: FollowerUserData;
  profileId?: string;
}

type IPressHandler = {
  onPickerSelect: () => void;
};

export enum FollowerActionTypes {
  CANCEL_REQUEST = 'Cancel Request',
  APPROVE_MEMBER = 'Approve Follower',
  REJECT_MEMBER = 'Reject Follower',
  BLOCK = 'Block',
  UNBLOCK = 'Unblock',
  MUTE = 'Mute',
  FOLLOW = 'Follow',
  UNFOLLOW = 'Unfollow',
  REPORT_ABUSE = 'Report Abuse',
}
const {CANCEL_REQUEST, UNFOLLOW, REPORT_ABUSE, BLOCK} = FollowerActionTypes;

const FollowerEllipseOptions = forwardRef<IPressHandler, IFollowerProps>(
  (props: IFollowerProps, ref) => {
    const {onClose, isOpen, follower, profileId} = props;
    const {handleCancel, handleBlock, handleUnfollow} = useProfileOperations();

    const onClickhandleCancelRequest = () => {
      onClose();
      handleCancel(
        follower ? follower.userId || '' : '',
        follower ? follower.userName || '' : '',
        profileId || '',
      );
    };
    const onClickhandleUnfollow = () => {
      onClose();
      handleUnfollow(
        follower ? follower.userId || '' : '',
        follower ? follower.userName || '' : '',
        profileId || '',
      );
    };

    const onClickBlock = () => {
      onClose();
      handleBlock(
        follower ? follower.userId || '' : '',
        follower ? follower.userName || '' : '',
        profileId || '',
      );
    };
    const isBlock = ['unfollow', 'blocked', 'follow back', 'approve follower', 'follow'].includes(
      follower?.relationship?.toLowerCase() || '',
    );

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            {isBlock ? (
              <Actionsheet.Item py="3" onPress={onClickBlock}>
                {BLOCK}
              </Actionsheet.Item>
            ) : null}

            {follower?.relationship?.toLowerCase() === 'following' && (
              <>
                <Actionsheet.Item py="3" onPress={onClickhandleUnfollow}>
                  {UNFOLLOW}
                </Actionsheet.Item>
                <Actionsheet.Item py="3" onPress={onClickBlock}>
                  {BLOCK}
                </Actionsheet.Item>
              </>
            )}

            {follower && follower.relationship.toLowerCase() === 'requested' && (
              <>
                <Actionsheet.Item py="3" onPress={onClickhandleCancelRequest}>
                  {CANCEL_REQUEST}
                </Actionsheet.Item>
                <Actionsheet.Item py="3" onPress={onClickBlock}>
                  {BLOCK}
                </Actionsheet.Item>
              </>
            )}
            {/* <Actionsheet.Item py="3" onPress={onClose}>
              {REPORT_ABUSE}
            </Actionsheet.Item> */}
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  },
);
FollowerEllipseOptions.defaultProps = {
  follower: undefined,
  profileId: '',
};
export default FollowerEllipseOptions;
