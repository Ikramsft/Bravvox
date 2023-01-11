/**
 * @format
 */
import React, {useState} from 'react';
import {Box, HStack, VStack, Text, useTheme, View} from 'native-base';
import {StyleSheet, TouchableOpacity} from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import {IComments, ILikeDisLikeComment, ReactionType} from '../types/NewsFeedInterface';
import {SubTitle, Title} from '../../../components/Typography';
import {FromType, Like, Unlike} from './Interactions';
import {timeDiffCalc} from '../../../utils';
import SafeTouchable from '../../../components/SafeTouchable';
import UserAvatar from '../../../components/UserAvatar';
import CommentOptions, {CommentPickerHandle} from './CommentOption';
import useUserInfo from '../../../hooks/useUserInfo';
import {useFeedActions} from './useToggleLike';
import TextContentView from './TextContentView';
import MaskedView from './MaskedView';

interface ILinkProps {
  openCommentatorProfile: (comments: IComments) => void;
}

interface ICommentsProps extends ILinkProps {
  documentId: string;
  comments: IComments[] | null;
  from: FromType;
  id: string;
  isMember?: boolean;
  onPressComment?: () => void;
  // eslint-disable-next-line react/require-default-props
  handleEdit: (selected: IComments) => void;
  userId?: string;
}

export interface ICommentProps extends ILinkProps {
  comment: IComments;
  isMember?: boolean;
  from: FromType;
  documentId: string;
  id: string;
  handleEdit: (selected: IComments) => void;
  setOptionClicked?: (value: boolean) => void;
  userId?: string;
}

export function CommentItem(props: ICommentProps) {
  const {
    comment,
    isMember,
    from,
    documentId,
    id,
    setOptionClicked,
    openCommentatorProfile,
    handleEdit,
  } = props;

  const [isLikeLoading, setIsLikeLoading] = useState<{type: ReactionType; isLoading: boolean}>({
    type: '',
    isLoading: false,
  });
  const {
    userInfo,
    commentText,
    likesCount,
    createdAt,
    userId,
    isLiked,
    isDisLiked,
    unLikesCount,
    documentId: commentId,
  } = comment;
  const {name, profilePic, influencerStatus} = userInfo;

  const commentOptions = React.useRef<CommentPickerHandle>(null);
  const {toggleLikeComment} = useFeedActions();

  const onOptionsClick = () => {
    if (typeof setOptionClicked === 'function') setOptionClicked(true);
    commentOptions.current?.onPickerSelect();
  };

  const onProfilePress = () => openCommentatorProfile(comment);

  const toggleLikeHandler = async (type: ReactionType) => {
    setIsLikeLoading({type, isLoading: true});
    const data: ILikeDisLikeComment = {
      contentId: documentId || '',
      commentId: commentId || '',
      like: type === 'like' ? !isLiked : false,
      dislike: type === 'dislike' ? !isDisLiked : false,
      reaction: isLiked ? 'like' : isDisLiked ? 'dislike' : 'nil',
    };
    await toggleLikeComment(data, from, id);
    setIsLikeLoading({type, isLoading: false});
  };

  return (
    <HStack justifyContent="space-between" mt="2">
      <HStack flex="1" pr="3">
        <View>
          <SafeTouchable onPress={onProfilePress}>
            <UserAvatar
              influencerStatus={influencerStatus}
              mt="0.5"
              profilePic={profilePic}
              size={34}
            />
          </SafeTouchable>
        </View>
        <View flex={isMember ? 0.99 : 1} ml={2}>
          <HStack>
            <VStack minWidth="100%">
              <SafeTouchable style={styles.profileWidth} onPress={onProfilePress}>
                <Title fontSize="xs" numberOfLines={1}>
                  {name}
                </Title>
              </SafeTouchable>
              <TextContentView
                collapse
                containerStyle={styles.commentContainerStyle}
                content={commentText}
                from="comments"
              />
              <HStack alignItems="center" mt="1" >
                <SubTitle mr="1">{timeDiffCalc(createdAt)}</SubTitle>
                <Like
                  isOnComment
                  from={from}
                  isLikeLoading={isLikeLoading}
                  liked={isLiked}
                  likesCount={likesCount}
                  onPress={() => toggleLikeHandler('like')}
                />
                <Unlike
                  isOnComment
                  disliked={isDisLiked}
                  from={from}
                  isLikeLoading={isLikeLoading}
                  unLikesCount={unLikesCount}
                  onPress={() => toggleLikeHandler('dislike')}
                />
                <SubTitle fontSize="xs" ml={2}>
                  Reply
                </SubTitle>
              </HStack>
            </VStack>
            {!isMember && from === 'group' ? null : (
              <SafeTouchable onPress={onOptionsClick}>
                <View alignItems="center" height={25} width={25}>
                  <SimpleLineIcons color="#818488" name="options" {...props} />
                </View>
              </SafeTouchable>
            )}
          </HStack>
        </View>
        <CommentOptions
          comment={comment}
          documentId={documentId}
          from={from}
          handleEdit={handleEdit}
          id={id}
          key={`option-${comment.documentId}-${userInfo.documentId}-${createdAt}`}
          ref={commentOptions}
          setOptionClicked={setOptionClicked}
          userInfo={{...userInfo, userId}}
        />
      </HStack>
    </HStack>
  );
}

CommentItem.defaultProps = {
  isMember: true,
  setOptionClicked: () => null,
  userId: null,
};

function Comments(props: ICommentsProps) {
  const {
    comments,
    documentId,
    from,
    id,
    isMember,
    openCommentatorProfile,
    onPressComment,
    handleEdit,
    userId,
  } = props;

  const {colors} = useTheme();
  const {user} = useUserInfo();
  const hideWriteComment = (from === 'group' || 'business' || 'event') && !isMember;
  const displayComment = comments && comments?.length > 0 ? comments.slice(0, 2) : [];

  const onHandleEdit = (item: IComments) => {
    if (handleEdit) {
      handleEdit(item);
    }
  };

  return (
    <Box mt="2" px="5">
      {displayComment.map(c => {
        return (
          <MaskedView comment={c} key={c.documentId}>
            <CommentItem
              comment={c}
              documentId={documentId}
              from={from}
              handleEdit={onHandleEdit}
              id={id}
              isMember={isMember}
              key={c.documentId}
              openCommentatorProfile={openCommentatorProfile}
              userId={userId}
            />
          </MaskedView>
        );
      })}
      {!hideWriteComment ? (
        <TouchableOpacity onPress={onPressComment}>
          <HStack
            alignItems="center"
            justifyContent="space-between"
            mt="2"
            position="relative"
            w="100%"
            zIndex={10}>
            <UserAvatar
              influencerStatus={user.influencerStatus}
              profilePic={user.profileCroppedPic}
              size={34}
            />
            <View
              _dark={{bg: colors.gray['700']}}
              _light={{bg: colors.appWhite['700']}}
              style={styles.inputContainer}>
              <View style={styles.inputStyle}>
                <Text color={colors.black['300']}>Write a comment</Text>
              </View>
            </View>
          </HStack>
        </TouchableOpacity>
      ) : null}
    </Box>
  );
}

const styles = StyleSheet.create({
  profileWidth: {width: '90%'},
  inputContainer: {
    marginLeft: 4,
    height: 36,
    borderRadius: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    width: '90%',
    fontSize: 13,
    alignSelf: 'center',
    paddingLeft: 10,
  },
  commentContainerStyle: {
    marginHorizontal: 0,
    marginTop: 0,
  },
});

Comments.defaultProps = {
  isMember: true,
  onPressComment: () => null,
  // eslint-disable-next-line react/default-props-match-prop-types
  handleEdit: () => null,
  userId: null,
};

export default Comments;
