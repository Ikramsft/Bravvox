import React, {useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ListRenderItem,
  Alert,
  useWindowDimensions,
} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {Spinner, Text} from 'native-base';
import Video from 'react-native-video';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {GroupProfileScreenProps} from '.';
import {useGroupMedia} from './Queries/useGroupMedia';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import {GalleryIcon} from '../../assets/svg';
import {theme} from '../../theme';
import Empty from '../../components/EmptyComponent';
import {RootStackParamList} from '../../navigation';
import MaskedView from '../Home/NewsFeed/MaskedView';

interface IPhotosProps extends GroupProfileScreenProps {
  groupId: string;
  isMember: boolean;
  loading: boolean;
  navigation: NativeStackNavigationProp<RootStackParamList, 'GroupProfile'>;
}

function Photos(props: IPhotosProps) {
  const {width} = useWindowDimensions();
  const {groupId, loading, isMember, navigation} = props;

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useGroupMedia(
    groupId,
    isMember,
  );

  const itemWidth = useMemo(() => width * 0.3, [width]);

  const renderPhotoItem: ListRenderItem<INewsFeedData> = ({item}) => {
    const isImage = item.contentDataType === 'image';
    let imageUrl = '';
    let videoPath;
    if (isImage) {
      const {original, overlay, small} = item.imageContentLink[0];
      imageUrl = original || overlay || small || '';
    }
    if (item.contentDataType === 'video') {
      const {VideoPath} = item.videoContentLink[0];
      videoPath = VideoPath;
    }

    return (
      <MaskedView
        isMedia
        containerStyle={StyleSheet.flatten([styles.maskedView, {width: itemWidth}])}
        newsFeed={item}>
        <TouchableOpacity
          key={item.userId}
          style={styles.item}
          onPress={() => {
            navigation.push('SinglePost', {
              feedData: item,
              documentId: item.documentId,
              userName: item.userInfo.userName,
              from: 'group',
              isMember: true,
              id: groupId,
            });
          }}>
          {isImage ? (
            <Image source={{uri: imageUrl}} style={styles.img} />
          ) : (
            <Video controls paused source={{uri: videoPath}} style={styles.img} />
          )}
          {item?.imageContentLink?.length > 1 ? (
            <TouchableOpacity style={styles.btn}>
              <GalleryIcon />
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
      </MaskedView>
    );
  };

  const keyExtractor = useCallback(
    (item: INewsFeedData, index: number) => `key-${index}-${item.documentId}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.flatContainer}
      data={isMember ? feedList : null}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isMember ? <Empty title="Be the first to add media to this group." /> : null
      }
      ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
      ListHeaderComponent={
        <>
          {(loading || isLoading) && <Spinner mb={20} mt={20} />}
          {!isLoading && !isMember && (
            <View style={styles.emptyComponent}>
              <Text>Please join the group to view media!</Text>
            </View>
          )}
        </>
      }
      numColumns={3}
      refreshing={isLoading}
      renderItem={renderPhotoItem}
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      onRefresh={refetch}
    />
  );
}

const styles = StyleSheet.create({
  maskedView: {
    width: '30%',
    height: 120,
    margin: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  item: {
    height: 120,
    // margin: 5,
    backgroundColor: theme.colors.black[800],
    borderRadius: 5,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  btn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  flatContainer: {
    width: '100%',
    marginLeft: 5,
    marginTop: 8,
    backgroundColor: theme.colors.white,
  },
  emptyComponent: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
});

export default Photos;
