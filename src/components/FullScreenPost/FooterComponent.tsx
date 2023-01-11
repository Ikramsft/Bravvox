/**
 * @format
 */
import React from 'react';
import {View, Text} from 'native-base';
import {StyleSheet, Linking, Platform} from 'react-native';
import {FromType, Interactions} from '../../screens/Home/NewsFeed/Interactions';
import {useFeedActions} from '../../screens/Home/NewsFeed/useToggleLike';
import {
  ILikeDisLikeGroupRequestData,
  INewsFeedData,
  ReactionType,
} from '../../screens/Home/types/NewsFeedInterface';
import {theme} from '../../theme';
import TextLessMoreView from '../TextLessMoreView';
import CommentView from './CommentView';
import {timeDiffCalc} from '../../utils';
import {IComments} from '../../screens/Comments/types/CommentsInterface';

interface OptionProps {
  from: FromType;
  isMember: boolean;
  feedData: INewsFeedData;
  id: string;
  commentsList: IComments[];
  // eslint-disable-next-line react/no-unused-prop-types
  isFetchingNextPage: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onEndReached: () => void;
}

function FooterComponent(props: OptionProps) {
  const {id, feedData, isMember, from, commentsList, onEndReached, isFetchingNextPage} = props;
  const bottomSheet = React.useRef<any>(null);
  const {toggleLikePost} = useFeedActions();

  const handleUrlPress = (url: string) => {
    Linking.openURL(url);
  };

  const toggleLikeHandler = async (type: ReactionType) => {
    const fromData: ILikeDisLikeGroupRequestData = {
      id: id || '',
      contentId: feedData.documentId || '',
      isLike: type === 'like',
      reaction: feedData.isLiked ? 'like' : feedData.isDisLiked ? 'dislike' : 'nil',
      isLikeReaction: type === 'like' ? !feedData.isLiked : false,
      isDisLikeReaction: type === 'dislike' ? !feedData.isDisLiked : false,
      like: type === 'like' ? !feedData.isLiked : false,
      dislike: type === 'dislike' ? !feedData.isDisLiked : false,
    };
    toggleLikePost(fromData, from);
  };

  return (
    <>
      <View style={styles.footerView}>
        <TextLessMoreView
          childrenProps={{allowFontScaling: false}}
          maxLine={10}
          parse={[{type: 'url', style: styles.url, onPress: handleUrlPress}]}
          parsedStyle={styles.readMoreContainer}
          seeMoreLessTextStyle={styles.seeMoreLessTextStyle}
          text={feedData.textContent}
        />
        <Text color={theme.colors.white}> {timeDiffCalc(feedData.createdAt)}</Text>
        <View style={styles.separatorView} />
        <Interactions
          from={from}
          isMember={isMember}
          newsFeed={feedData}
          toggleLike={(type: string) => toggleLikeHandler(type as ReactionType)}
          onCommentPress={() => {
            bottomSheet?.current?.openCommentView();
          }}
        />
      </View>
      <CommentView
        commentsList={commentsList}
        feedData={feedData}
        from={from}
        id={id}
        isFetchingNextPage={isFetchingNextPage}
        isMember={isMember}
        ref={bottomSheet}
        onEndReached={onEndReached}
      />
    </>
  );
}

const styles = StyleSheet.create({
  footerView: {
    backgroundColor: theme.colors.transparentBlack[100],
    width: '100%',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 40 : 10,
    bottom: 0,
    position: 'absolute',
  },
  readMoreContainer: {
    marginHorizontal: 8,
    marginVertical: 0,
    marginTop: 8,
    fontFamily: 'DMSANS-Regular',
    fontSize: 14,
    color: theme.colors.white,
  },
  url: {
    color: theme.colors.blue[600],
    textDecorationLine: 'underline',
    fontFamily: 'DMSANS-Regular',
    fontSize: 14,
  },
  seeMoreLessTextStyle: {
    marginHorizontal: 8,
    color: theme.colors.white,
  },
  separatorView: {
    backgroundColor: theme.colors.white,
    height: 0.5,
    marginVertical: 14,
  },
});

export default FooterComponent;
