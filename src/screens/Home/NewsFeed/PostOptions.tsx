/**
 * @format
 */

import React, {forwardRef, useImperativeHandle, useMemo} from 'react';
import {View, Actionsheet, useDisclose, Text, useTheme} from 'native-base';
import Clipboard from '@react-native-clipboard/clipboard';
import {Keyboard} from 'react-native';

import {useUserProfile} from '../../Profile/Queries/useUserProfile';
import {IUserInfo} from '../types/NewsFeedInterface';
import {showSnackbar} from '../../../utils/SnackBar';
import {useProfileOperations} from '../../Profile/Queries/useProfileOperations';

type FollowOptionType = 'follow' | 'cancel_follow_request' | 'unfollow';

export type PostOption = FollowOptionType | 'share' | 'copy_link' | 'report_abuse';

interface IPickerProps {
  onSelectAbuse: () => void;
  onSelectEdit?: () => void;
  onSelectDelete?: () => void;
  userInfo: IUserInfo;
}

type IPressHandler = {
  onPickerSelect: (type?: PostOption) => void;
};

const PostOptions = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  const {userInfo, onSelectAbuse, onSelectEdit, onSelectDelete} = props;

  const {colors} = useTheme();

  const {isOpen, onOpen, onClose} = useDisclose();

  const {isLoading, data: userData, isError, refetch} = useUserProfile(userInfo?.userName, false);

  useImperativeHandle(ref, () => ({onPickerSelect: onOpenPostOptions}));

  const onOpenPostOptions = () => {
    Keyboard.dismiss();
    refetch();
    onOpen();
  };

  const {handleFollow, handleCancel, handleUnfollow, handleFollowBackUser, handleApprove} =
    useProfileOperations();
  const sleep = (time: number | undefined) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  // const share = async () => {
  //   onClose();
  //   try {
  //     await sleep(500);
  //     const result = await Share.share({
  //       message: 'Checkout this amazing post on Bravvox',
  //       url: 'https://dev.bravvox.com/posts/:documentId',
  //       title: 'post_title',
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //         console.log('shared using', result.activityType);
  //       } else {
  //         // shared
  //         console.log('shared using', result.action);
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //       console.log('shared dismissed');
  //     }
  //   } catch (error) {
  //     // alert(error.message);
  //     console.log(error);
  //   }
  // };

  const copyLink = () => {
    // TODO: add link format dynamic
    Clipboard.setString('https://dev.bravvox.com/posts/:documentId');
    showSnackbar({message: 'Post Link Copied', type: 'info'});
    onClose();
  };

  const editPost = () => {
    onClose();
    if (onSelectEdit) {
      onSelectEdit();
    }
  };

  const deletePost = () => {
    onClose();
    if (onSelectDelete) {
      onSelectDelete();
    }
  };

  const abuse = () => {
    onClose();
    if (typeof onSelectAbuse === 'function') {
      onSelectAbuse();
    }
  };
  // const isSelf = Boolean(documentId === userInfo?.documentId);
  const {text, followAction, isSelf} = useMemo(() => {
    const followUser = async () => {
      onClose();
      handleFollow(userInfo?.documentId || '', userInfo?.userName);
      refetch();
    };
    const unfollowUser = async () => {
      onClose();
      handleUnfollow(userInfo?.documentId || '', userInfo?.userName);
      refetch();
    };
    const ApproveUser = async () => {
      onClose();
      handleApprove(userInfo?.documentId || '', userInfo?.userName, 'profile');
      refetch();
    };

    const followBackUser = async () => {
      onClose();
      handleFollowBackUser(userInfo?.documentId || '', userInfo?.userName);
      refetch();
    };
    const cancelFollowRequest = async () => {
      onClose();
      handleCancel(userInfo?.documentId || '', userInfo?.userName);
      refetch();
    };

    let btext = 'Follow';
    let bfollowAction = followUser;
    let bIsSelf = false;

    if (userData) {
      const {relationshipInfo} = userData;
      if (relationshipInfo) {
        const {Relationship} = relationshipInfo;
        if (Relationship.toLowerCase() === 'self') {
          bIsSelf = true;
        }

        if (Relationship.toLowerCase() === 'requested') {
          btext = 'Cancel Request';
          bfollowAction = cancelFollowRequest;
        }

        if (
          Relationship.toLowerCase() === 'follower' ||
          Relationship.toLowerCase() === 'follow back'
        ) {
          btext = 'Follow Back';
          bfollowAction = followBackUser;
        }

        if (
          Relationship.toLowerCase() === 'following' ||
          Relationship.toLowerCase() === 'unfollow'
        ) {
          btext = 'Unfollow';
          bfollowAction = unfollowUser;
        }

        if (Relationship.toLowerCase() === 'following me') {
          btext = 'Unfollow';
          bfollowAction = unfollowUser;
        }
        if (Relationship.toLowerCase() === 'approve follower') {
          btext = 'Approve Follower';
          bfollowAction = ApproveUser;
        }
      }
    }

    return {
      text: btext,
      followAction: bfollowAction,
      isSelf: bIsSelf,
    };
  }, [
    handleApprove,
    handleCancel,
    handleFollow,
    handleFollowBackUser,
    handleUnfollow,
    onClose,
    refetch,
    userData,
    userInfo?.documentId,
    userInfo?.userName,
  ]);

  if (!userInfo || isLoading || isError) {
    return null;
  }

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          {!isSelf ? (
            <Actionsheet.Item display="flex" flexDirection="row" py="3" onPress={followAction}>
              <Text _light={{color: colors.black['900']}} fontFamily="heading" fontSize="17">
                {text} <Text bold>{`@${userInfo.userName}`}</Text>
              </Text>
            </Actionsheet.Item>
          ) : null}
          {isSelf ? (
            <Actionsheet.Item py="3" onPress={editPost}>
              Edit
            </Actionsheet.Item>
          ) : null}
          {isSelf ? (
            <Actionsheet.Item py="3" onPress={deletePost}>
              Delete
            </Actionsheet.Item>
          ) : null}
          <Actionsheet.Item py="3" onPress={copyLink}>
            Copy Link
          </Actionsheet.Item>
          {/* <Actionsheet.Item py="3" onPress={share}>
            Share
          </Actionsheet.Item> */}
          {/* {!isSelf ? (
            <Actionsheet.Item py="3" onPress={abuse}>
              Report Abuse
            </Actionsheet.Item>
          ) : null} */}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});
PostOptions.defaultProps = {
  onSelectDelete: () => null,
  onSelectEdit: () => null,
};
export type PickerHandle = React.ElementRef<typeof PostOptions>;
export default PostOptions;
