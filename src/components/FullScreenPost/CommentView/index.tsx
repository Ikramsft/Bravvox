/**
 * @format
 */
import React, {forwardRef, useState, useImperativeHandle, useRef, useMemo} from 'react';
import {Spinner, View} from 'native-base';
import {StyleSheet, Text} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import BottomSheet, {BottomSheetFlatList, BottomSheetFlatListMethods} from '@gorhom/bottom-sheet';
import {CommentItem} from '../../../screens/Home/NewsFeed/Comments';
import WriteComment from '../../../screens/Home/NewsFeed/WriteComment';
import {IComments} from '../../../screens/Comments/types/CommentsInterface';
import {FromType} from '../../../screens/Home/NewsFeed/Interactions';
import {INewsFeedData} from '../../../screens/Home/types/NewsFeedInterface';
import {navigate} from '../../../navigation/navigationRef';
import {useFullScreenPost} from '../useFullScreenPost';
import {isIOS} from '../../../constants/common';
import MaskedView from '../../../screens/Home/NewsFeed/MaskedView';

MDIcon.loadFont();
interface OptionProps {
  from: FromType;
  isMember: boolean;
  feedData: INewsFeedData;
  id: string;
  // eslint-disable-next-line react/no-unused-prop-types
  commentsList: IComments[];
  // eslint-disable-next-line react/no-unused-prop-types
  onEndReached: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  isFetchingNextPage: boolean;
}

const CommentView = forwardRef((props: OptionProps, ref) => {
  const {from, isMember, feedData, id, commentsList, onEndReached, isFetchingNextPage} = props;
  const {hidePost} = useFullScreenPost();
  const [selectedComment, setSelectedComment] = useState<IComments | undefined>(undefined);
  const [value, setValue] = React.useState<string>('');

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);

  const flatListRef = useRef<BottomSheetFlatListMethods>(null);

  React.useEffect(() => {
    setValue(selectedComment ? selectedComment.commentText : '');
  }, [selectedComment, value]);

  useImperativeHandle(ref, () => ({
    openCommentView() {
      bottomSheetRef.current?.expand();
    },
  }));

  const openCommentatorProfile = (comment: IComments) => {
    hidePost();
    const {userName} = comment.userInfo;
    const {userId: commentUserId} = comment;
    navigate('Profile', {userName, userId: commentUserId});
  };

  const scrollToTop = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  const renderItem = ({item}: {item: IComments}) => (
    <View style={styles.parsedStyle}>
      <MaskedView comment={item} key={item.documentId}>
        <CommentItem
          comment={item}
          documentId={feedData.documentId}
          from={from}
          id={id || ''}
          isMember={isMember}
          key={item.documentId}
          openCommentatorProfile={openCommentatorProfile}
          setSelectedComment={setSelectedComment}
        />
      </MaskedView>
    </View>
  );

  return (
    <BottomSheet enablePanDownToClose index={-1} ref={bottomSheetRef} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        <BottomSheetFlatList
          data={commentsList}
          keyExtractor={item => item.documentId.toString()}
          ListEmptyComponent={
            <View alignItems="center" justifyContent="center" minHeight={350}>
              <Text>No Comments Yet...</Text>
            </View>
          }
          ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
          ref={flatListRef}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
        />

        <View style={styles.commentView}>
          <WriteComment
            documentId={feedData?.documentId || ''}
            focus={undefined}
            from={from}
            id={id}
            selectedComment={selectedComment || undefined}
            setSelectedComment={setSelectedComment}
            value={value}
            onScrollToTop={scrollToTop}
          />
        </View>
      </View>
    </BottomSheet>
  );
});

export default CommentView;

const styles = StyleSheet.create({
  parsedStyle: {
    marginHorizontal: 20,
    marginVertical: 0,
    marginTop: 8,
    fontFamily: 'DMSANS-Regular',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
  },
  commentView: {
    paddingBottom: isIOS ? 20 : 0,
  },
});
