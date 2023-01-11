import React from 'react';
import {View, Spinner, Text} from 'native-base';
import {FlatList, ListRenderItem, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import {RootNavigationType} from '../Home';
import {IComments} from './types/CommentsInterface';
import {CommentItem} from '../Home/NewsFeed/Comments';
import WriteComment from '../Home/NewsFeed/WriteComment';
import {theme} from '../../theme';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {usePostComments} from '../SinglePost/usePostComments';
import MaskedView from '../Home/NewsFeed/MaskedView';

export type CommentsScreenProps = NativeStackScreenProps<RootStackParamList, 'Comments'>;

function Comments(props: CommentsScreenProps) {
  const navigation = useNavigation<RootNavigationType>();
  const {route} = props;
  const {documentId, from, id, isMember} = route.params;

  const {
    commentsList: comments,
    isLoading,
    isFetchingNextPage,
    onEndReached,
  } = usePostComments(documentId, from, id);
  const [selectedComment, setSelectedComment] = React.useState<IComments | undefined>(undefined);
  const [value, setValue] = React.useState('');
  const [optionsClicked, setOptionClicked] = React.useState(false);

  const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
  const headerTitle = () => <HeaderTitle title="Comments" />;

  React.useEffect(() => {
    setValue(selectedComment ? selectedComment.commentText : '');
  }, [selectedComment]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerLeft,
      headerRight: () => null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  const openCommentatorProfile = (comment: IComments) => {
    const {userName} = comment.userInfo;
    const {userId: commentUserId} = comment;
    navigation.push('Profile', {userName, userId: commentUserId});
  };
  const handleOptionClicked = (isVisible: boolean) => {
    setOptionClicked(isVisible);
  };

  const renderItem: ListRenderItem<IComments> = ({item}) => {
    return (
      <MaskedView comment={{...item, contentId: documentId}} key={item.documentId}>
        <CommentItem
          comment={{...item, contentId: documentId}}
          documentId={documentId}
          from={from}
          id={id}
          isMember={isMember}
          key={item.documentId}
          openCommentatorProfile={openCommentatorProfile}
          setOptionClicked={handleOptionClicked}
          setSelectedComment={setSelectedComment}
        />
      </MaskedView>
    );
  };
  function renderFooter() {
    return optionsClicked ? null : (
      <WriteComment
        documentId={documentId}
        focus={undefined}
        from={from}
        id={id}
        selectedComment={selectedComment}
        setSelectedComment={setSelectedComment}
        value={value}
      />
    );
  }

  return (
    <View backgroundColor={theme.colors.white} flex={1}>
      <FlatList
        contentContainerStyle={[styles.container, {backgroundColor: theme.colors.white}]}
        data={comments}
        keyboardShouldPersistTaps="handled"
        keyExtractor={item => item.documentId.toString()}
        ListEmptyComponent={
          <View alignItems="center" justifyContent="center" minHeight={350}>
            <Text>No Comments Yet...</Text>
          </View>
        }
        ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
        ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
        refreshing={isLoading}
        renderItem={renderItem}
        onRefresh={onEndReached}
      />
      {isMember && renderFooter()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 14,
    width: '100%',
  },
});

export default Comments;
