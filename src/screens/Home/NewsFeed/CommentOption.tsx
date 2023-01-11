/**
 * @format
 */

import React, {forwardRef, useCallback, useImperativeHandle, useMemo} from 'react';
import {View, Actionsheet, useDisclose, Text} from 'native-base';
import {Keyboard} from 'react-native';
import {useUserProfile} from '../../Profile/Queries/useUserProfile';
import {IComments, IReportComment, IUserInfo} from '../types/NewsFeedInterface';
// import {useFollowActions} from './useFollowActions';
import useUserInfo from '../../../hooks/useUserInfo';
import {useComment} from '../useComment';
import ReportAbuseDialog from './ReportAbuseDialog';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Title} from '../../../components/Typography';
import {FromType} from './Interactions';
import { useProfileOperations } from '../../Profile/Queries/useProfileOperations';

type FollowOptionType = 'follow' | 'cancel_follow_request' | 'unfollow';

export type CommentOption = FollowOptionType | 'report_abuse';

interface ICommentUserInfo extends IUserInfo {
  userId: string;
}

interface IPickerProps {
  userInfo: ICommentUserInfo;
  comment: IComments;
  documentId: string;
  handleEdit: (comment: IComments) => void;
  from: FromType;
  id: string;
  setOptionClicked?: (value: boolean) => void;
}

type IPressHandler = {
  onPickerSelect: (type?: CommentOption) => void;
};

const CommentOptions = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  useImperativeHandle(ref, () => ({
    onPickerSelect: onOpenCommentOptions,
  }));

  const {isOpen, onOpen, onClose} = useDisclose();
  const {isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose} = useDisclose();

  const {documentId: userId} = useUserInfo();

  const {userInfo, comment, handleEdit, from, id, setOptionClicked} = props;
  const confirm = useConfirmModal();
  const {commentReportAbuse, deleteComment} = useComment();

  const {isLoading, data: userData, isError, refetch} = useUserProfile(userInfo?.userName, false);

  const onOpenCommentOptions = () => {
    onOpen();
    refetch();
    Keyboard.dismiss();
    // refetch();
   
  };
  // const {followUser: follow, cancelRequest, unfollow} = useFollowActions();
  const {handleFollow, handleCancel, handleUnfollow, handleFollowBackUser} = useProfileOperations();

  // const {onSelectOption} = props;
  const editPost = () => {
    onClose();
    if (typeof setOptionClicked === 'function') setOptionClicked(false);
    handleEdit(comment);
  };

  const deletePost = () => {
    onClose();
    if (typeof setOptionClicked === 'function') setOptionClicked(false);
    confirm?.show?.({
      title: <Title fontSize={18}>Delete Comment</Title>,
      message: (
        <Text>
          <Text>Are you sure you want to delete your comment?</Text>
        </Text>
      ),
      onConfirm: () => {
        deleteComment({contentId: comment.contentId, commentId: comment.documentId}, from, id);
        onClose();
      },
      submitLabel: 'Delete',
      cancelLabel: 'Cancel',
    });
  };

  const handleReportAbuse = async (reason: string) => {
    try {
      const data: IReportComment = {
        commentId: comment?.documentId,
        contentId: comment?.contentId,
        contentType: 'text',
        reason,
      };
      await commentReportAbuse(data);
      onReportClose();
    } catch (error) {
      onReportClose();
    }
  };

  const abuse = () => {
    onClose();
    if (typeof setOptionClicked === 'function') setOptionClicked(false);
    onReportOpen();
  };

  const handleCloseActionSheet = useCallback(() => {
    onClose();
    if (typeof setOptionClicked === 'function') setOptionClicked(false);
  }, [setOptionClicked, onClose]);

  const isSelf = Boolean(userId === userInfo?.userId);

  const {text, followAction} = useMemo(() => {
    const followUser = async () => {
      handleCloseActionSheet();
      await handleFollow(userInfo?.userId, userInfo?.userName);
      refetch();
    };
    const unfollowUser = async () => {
      handleCloseActionSheet();
      await handleUnfollow(userInfo?.userId, userInfo?.userName);
      refetch();
    };

    const followBackUser = async () => {
      handleCloseActionSheet();
      await handleFollowBackUser(userInfo?.userId, userInfo?.userName);
      refetch();
    };
    const cancelFollowRequest = async () => {
      handleCloseActionSheet();
      await handleCancel(userInfo?.userId, userInfo?.userName);
      refetch();
    };

    let btext = 'Follow';
    let bfollowAction = followUser;

    if (userData) {
      const {relationshipInfo} = userData;
      if (relationshipInfo) {
        const {Relationship} = relationshipInfo;

        if (Relationship.toLowerCase() === 'requested') {
          btext = 'Cancel Request';
          bfollowAction = cancelFollowRequest;
        }

        if (Relationship.toLowerCase() === 'follower'|| Relationship.toLowerCase() === 'follow back') {
          btext = 'Follow Back';
          bfollowAction = followBackUser;
        }

        if (Relationship.toLowerCase() === 'following' || Relationship.toLowerCase() === 'unfollow') {
          btext = 'Unfollow';
          bfollowAction = unfollowUser;
        }

        if (Relationship.toLowerCase() === 'following me') {
          btext = 'Unfollow';
          bfollowAction = unfollowUser;
        }
      }
    }

    return {
      text: btext,
      followAction: bfollowAction,
    };
  }, [userData, handleCloseActionSheet, handleFollow, userInfo?.userId, userInfo?.userName, refetch, handleUnfollow, handleFollowBackUser, handleCancel]);

  if (!userInfo || isLoading || isError) {
    return null;
  }
  const handleClose = () => {
    onClose();
    onReportClose();
  };

  return (
    <View height={0} ref={ref} width={0}>
      <ReportAbuseDialog
        handleClose={handleClose}
        handleSubmit={handleReportAbuse}
        open={isReportOpen}
      />
      <Actionsheet isOpen={isOpen} onClose={handleCloseActionSheet}>
        <Actionsheet.Content>
          {isSelf === true ? (
            <>
              <Actionsheet.Item py="3" onPress={editPost}>
                Edit
              </Actionsheet.Item>
              <Actionsheet.Item py="3" onPress={deletePost}>
                Delete
              </Actionsheet.Item>
            </>
          ) : (
            <>
              <Actionsheet.Item display="flex" flexDirection="row" py="3" onPress={followAction}>
                <Text color="black.900" fontFamily="heading" fontSize="17">
                  {text} <Text bold>{`@${userInfo.userName}`}</Text>
                </Text>
              </Actionsheet.Item>
              {/* <Actionsheet.Item py="3" onPress={abuse}>
                Report Abuse
              </Actionsheet.Item> */}
            </>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});

CommentOptions.defaultProps = {
  setOptionClicked: () => {
    //
  },
};
export type CommentPickerHandle = React.ElementRef<typeof CommentOptions>;
export default CommentOptions;
