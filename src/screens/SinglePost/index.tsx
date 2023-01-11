import React, {useCallback, useState} from 'react';
import {StyleSheet, BackHandler} from 'react-native';
import {Text, useDisclose, Spinner, View} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useSelector} from 'react-redux';
import {KeyboardAwareFlatList} from 'react-native-keyboard-aware-scroll-view';
import {RootStackParamList} from '../../navigation';
import ReportAbuseDialog from '../Home/NewsFeed/ReportAbuseDialog';
import {IComments, IReportAbuseRequestData} from '../Home/types/NewsFeedInterface';
import {useFeedActions} from '../Home/NewsFeed/useToggleLike';
import {CommentItem} from '../Home/NewsFeed/Comments';
import WriteComment from '../Home/NewsFeed/WriteComment';
import {useFullScreenPost} from '../../components/FullScreenPost/useFullScreenPost';
import {RootState} from '../../redux/store';
import {useSingleNewsFeedPost} from './useSingleNewsFeed';
import NewsFeedLayout from '../Home/NewsFeed/NewsFeedLayout';
import MaskedView from '../Home/NewsFeed/MaskedView';
import HeaderLeft from '../../components/HeaderLeft';

export type SinglePostProps = NativeStackScreenProps<RootStackParamList, 'SinglePost'>;

function SinglePost(props: SinglePostProps) {
  const {route, navigation} = props;
  const {documentId, isMember, id, userName, focus, editComment, from} = route?.params || {};
  const [optionsClicked, setOptionClicked] = React.useState(false);
  const [shouldFocus, setShouldFocus] = useState(focus);

  React.useEffect(() => {
    // Patch for focus to work only first time
    if (shouldFocus) {
      const tm = setTimeout(() => {
        setShouldFocus(false);
        clearTimeout(tm);
      }, 1000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {isLoadingPostDetail, feedData, commentsList, isFetchingNextPage, onEndReached} =
    useSingleNewsFeedPost(documentId || '', from, userName, id || '');

  const {hidePost, showPost} = useFullScreenPost();

  const {isOpen: isOpenDialog, onToggle: toggleAbuseDialog} = useDisclose();

  const [value, setValue] = React.useState('');
  const [selectedComment, setSelectedComment] = useState<IComments | undefined>(undefined);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const title = feedData?.userInfo?.name ? `${feedData?.userInfo?.name}'s Post` : '';
    navigation.setOptions({
      headerShown: true,
      title,
      headerTitleAlign: 'center',
      headerLeft,
      headerRight: () => null,
    });
  });

  React.useEffect(() => {
    setValue(selectedComment ? selectedComment.commentText : '');
  }, [selectedComment]);

  React.useEffect(() => {
    if (!feedData && navigation.canGoBack()) {
      // navigation.goBack();
    }
  }, [feedData, navigation]);

  const {visible} = useSelector((state: RootState) => state.fullScreenPostReducer);

  React.useEffect(() => {
    function backButtonHandler() {
      if (visible) {
        hidePost();
      } else if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', backButtonHandler);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backButtonHandler);
    };
  }, [visible, navigation, hidePost]);

  React.useEffect(() => {
    if (editComment) {
      setSelectedComment(editComment);
    }
  }, [editComment]);

  const {postReportAbuse} = useFeedActions();

  const openCommentatorProfile = useCallback(
    (comment: IComments) => {
      const {userId: commentUserId} = comment;
      navigation.push('Profile', {userName, userId: commentUserId});
    },
    [navigation, userName],
  );

  const handleReportAbuse = async (reason: string) => {
    try {
      const fromData: IReportAbuseRequestData = {
        contentId: feedData?.documentId || '',
        contentType: feedData?.contentDataType || '',
        reason,
      };
      await postReportAbuse(fromData);
      toggleAbuseDialog();
    } catch (error) {
      toggleAbuseDialog();
    }
  };

  const handleOptionClicked = (isVisible: boolean) => setOptionClicked(isVisible);

  const handleShowPost = () => {
    showPost({
      visible: true,
      fullScreenPost: feedData,
      id: id || '',
      from,
      isMember,
      userName,
    });
  };

  const renderItem = ({item}: {item: IComments}) => (
    <View style={styles.parsedStyle}>
      <MaskedView comment={{...item, contentId: feedData?.documentId || ''}} key={item.documentId}>
        <CommentItem
          comment={{...item, contentId: feedData?.documentId || ''}}
          documentId={feedData?.documentId || ''}
          from={from}
          handleEdit={setSelectedComment}
          id={id || ''}
          isMember={isMember}
          key={item.documentId}
          openCommentatorProfile={openCommentatorProfile}
          setOptionClicked={handleOptionClicked}
        />
      </MaskedView>
    </View>
  );

  function renderFooter() {
    return !optionsClicked ? (
      <WriteComment
        documentId={feedData?.documentId || ''}
        focus={shouldFocus}
        from={from}
        id={id || ''}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        value={value}
      />
    ) : null;
  }

  if (isLoadingPostDetail) {
    return <Spinner mt={2} />;
  }

  if (feedData) {
    return (
      <View style={styles.mainContainer}>
        <ReportAbuseDialog
          handleClose={toggleAbuseDialog}
          handleSubmit={handleReportAbuse}
          open={isOpenDialog}
        />
        <KeyboardAwareFlatList
          contentContainerStyle={styles.container}
          data={commentsList}
          keyboardShouldPersistTaps="handled"
          keyExtractor={item => item.documentId.toString()}
          ListEmptyComponent={
            <View alignItems="center" justifyContent="center" minHeight={350}>
              <Text>No Comments Yet...</Text>
            </View>
          }
          ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
          ListHeaderComponent={
            <NewsFeedLayout
              isSinglePostView
              from={from}
              handleShowPost={handleShowPost}
              id={id}
              isMember={isMember}
              key={feedData.documentId}
              navigation={navigation}
              newsFeed={feedData}
              showComments={false}
            />
          }
          refreshing={isLoadingPostDetail}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />
        {isMember && renderFooter()}
        {/* <FullScreenPost /> */}
      </View>
    );
  }
  return null;
}

export default SinglePost;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  parsedStyle: {
    marginHorizontal: 20,
    marginVertical: 0,
    marginTop: 8,
    fontFamily: 'DMSANS-Regular',
    fontSize: 14,
  },
  container: {
    marginVertical: 0,
    marginTop: 8,
    paddingBottom: 30,
  },
});
