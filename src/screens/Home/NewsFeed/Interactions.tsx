/**
 * @format
 */
import React from 'react';
import {View, HStack} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {INewsFeedData, ReactionType} from '../types/NewsFeedInterface';
import {formatCount} from '../../../utils';
import {SubTitle} from '../../../components/Typography';
import {theme} from '../../../theme';

import {
  LikeIcon,
  LikeRedIcon,
  DislikeIcon,
  DislikeRedIcon,
  SharePostIcon,
} from '../../../assets/svg/index';

export type FromType =
  | 'group'
  | 'home'
  | 'profile'
  | 'business'
  | 'event'
  | 'popular'
  | 'homeGroup'
  | 'homeEvent';

interface IInteractionProps {
  newsFeed: INewsFeedData;
  toggleLike: (type: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  from: FromType;
  isMember?: boolean;
  onCommentPress?: () => void;
  isLikeLoading?: {
    type: ReactionType;
    isLoading: boolean;
  };
}

interface IWriteComment {
  disabled: boolean;
  size: number;
  onPress: () => void;
}

interface ILikeProps {
  liked: boolean;
  likesCount: number;
  onPress?: () => void;
  showZeroCount?: boolean;
  isMember?: boolean;
  isLikeLoading?: {
    type: ReactionType;
    isLoading: boolean;
  };
  from?: string;
  isOnComment?: boolean;
}

interface IUnlikeProps {
  disliked: boolean;
  unLikesCount: number;
  onPress?: () => void;
  showZeroCount?: boolean;
  isMember?: boolean;
  isLikeLoading?: {
    type: ReactionType;
    isLoading: boolean;
  };
  from?: string;
  isOnComment?: boolean;
}

interface ICommentCountProps {
  commentsCount: number;
  onPress: () => void;
  from?: string;
  isMember?: boolean;
}

interface IShareProps {
  shareCount: number;
}

export function Container(props: IViewProps) {
  const {children, ...rest} = props;
  return (
    <View alignItems="center" flexDir="row" minW="8" {...rest}>
      {children}
    </View>
  );
}

export function Like(props: ILikeProps) {
  const {liked, likesCount, showZeroCount, isLikeLoading, onPress, isMember, from, isOnComment} =
    props;
  const likeText = formatCount(likesCount);
  const displayText = likesCount > 0 ? likeText : showZeroCount ? '0' : '';
  const iconProps = isOnComment ? {height: 16, width: 16} : {};
  const icon = liked ? <LikeRedIcon {...iconProps} /> : <LikeIcon {...iconProps} />;
  const isLoading =
    ((from === 'group' || from === 'event') && !isMember) ||
    (isLikeLoading?.type === 'like' && isLikeLoading?.isLoading);

  return (
    <TouchableOpacity disabled={isLoading} onPress={onPress}>
      <Container>
        {icon}
        {displayText !== '' && (
          <SubTitle ml="2" mr="2">
            {likeText}
          </SubTitle>
        )}
      </Container>
    </TouchableOpacity>
  );
}

Like.defaultProps = {
  showZeroCount: false,
  onPress: null,
  isLikeLoading: {
    type: '',
    isLoading: false,
  },
  isMember: true,
  from: '',
  isOnComment: false,
};

export function Unlike(props: IUnlikeProps) {
  const {
    disliked,
    unLikesCount,
    isLikeLoading,
    showZeroCount,
    onPress,
    isMember,
    from,
    isOnComment,
  } = props;
  const unlikeText = formatCount(unLikesCount);
  const displayText = unLikesCount > 0 ? unlikeText : showZeroCount ? '0' : '';
  const iconProps = isOnComment ? {height: 16, width: 16} : {};
  const icon = disliked ? <DislikeRedIcon {...iconProps} /> : <DislikeIcon {...iconProps} />;
  const isLoading =
    ((from === 'group' || from === 'event') && !isMember) ||
    (isLikeLoading?.type === 'dislike' && isLikeLoading?.isLoading);
  return (
    <TouchableOpacity disabled={isLoading} onPress={onPress}>
      <Container>
        {icon}
        {displayText !== '' && <SubTitle ml="2">{unlikeText}</SubTitle>}
      </Container>
    </TouchableOpacity>
  );
}

Unlike.defaultProps = {
  showZeroCount: false,
  onPress: null,
  isMember: true,
  isLikeLoading: {
    type: '',
    isLoading: false,
  },
  from: '',
  isOnComment: false,
};

function CommentsCount({commentsCount, onPress, from, isMember}: ICommentCountProps) {
  const countText = formatCount(commentsCount);

  const disable = (from === 'group' || from === 'event') && !isMember;

  return (
    <TouchableOpacity disabled={disable || !onPress} onPress={onPress}>
      <Container justifyContent="flex-end" mr="1">
        <SimpleLineIcons color="#959699" name="bubble" size={20} />
        {commentsCount > 0 && <SubTitle ml="2">{countText}</SubTitle>}
      </Container>
    </TouchableOpacity>
  );
}

CommentsCount.defaultProps = {
  from: '',
  isMember: true,
};

export function SendIcon(props: IWriteComment) {
  const {onPress, disabled, size} = props;
  return (
    <TouchableOpacity disabled={disabled} style={styles.sendButton} onPress={onPress}>
      <Ionicons
        color={disabled ? theme.colors.black[400] : theme.colors.blue[400]}
        name="send"
        size={size}
      />
    </TouchableOpacity>
  );
}

function Shares({shareCount}: IShareProps) {
  const countText = formatCount(shareCount);
  return (
    <TouchableOpacity>
      <Container justifyContent="flex-end">
        <SharePostIcon />
        {shareCount > 0 && <SubTitle ml="2">{countText}</SubTitle>}
      </Container>
    </TouchableOpacity>
  );
}

export function Interactions(props: IInteractionProps) {
  const {newsFeed, from, isMember, toggleLike, onCommentPress, isLikeLoading} = props;

  return (
    <HStack flexDirection="row" justifyContent="space-between" mt="2" px="5">
      <HStack alignItems="center">
        <Like
          from={from}
          isLikeLoading={isLikeLoading}
          isMember={isMember}
          liked={newsFeed.isLiked}
          likesCount={newsFeed.likesCount}
          onPress={() => toggleLike('like')}
        />
        <Unlike
          disliked={newsFeed.isDisLiked}
          from={from}
          isLikeLoading={isLikeLoading}
          isMember={isMember}
          unLikesCount={newsFeed.unLikesCount}
          onPress={() => toggleLike('dislike')}
        />
      </HStack>
      <HStack alignItems="center">
        <CommentsCount
          commentsCount={newsFeed.commentsCount}
          from={from}
          isMember={isMember}
          onPress={() => {
            if (onCommentPress) {
              onCommentPress();
            }
          }}
        />
        <Shares shareCount={newsFeed.shareCount} />
      </HStack>
    </HStack>
  );
}

Interactions.defaultProps = {
  isMember: true,
  onCommentPress: null,
  isLikeLoading: false,
};

const styles = StyleSheet.create({
  sendButton: {
    justifyContent: 'center',
  },
});
