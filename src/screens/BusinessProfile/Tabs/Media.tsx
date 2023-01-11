/**
 * @format
 */
import React, {useCallback, useMemo} from 'react';
import {Spinner, Text, View} from 'native-base';
import {Tabs} from 'react-native-collapsible-tab-view';
import {ListRenderItem, StyleSheet, Image, TouchableOpacity, useWindowDimensions} from 'react-native';
import Video from 'react-native-video';
import {BusinessProfileScreenProps} from '..';
import {INewsFeedData} from '../../Home/types/NewsFeedInterface';
import {useBusinessMedia} from '../Queries/useBusinessMedia';
import {GalleryIcon} from '../../../assets/svg';
import {theme} from '../../../theme';
import Empty from '../../../components/EmptyComponent';
import MaskedView from '../../Home/NewsFeed/MaskedView';

interface IPostProps extends BusinessProfileScreenProps {
  businessId: string;
  isMember: boolean;
  isInviteeOfPrivateBusiness: boolean | undefined;
}

function Media(props: IPostProps) {
  const {width} = useWindowDimensions();
  const {businessId, isMember, isInviteeOfPrivateBusiness} = props;

  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useBusinessMedia(
    businessId,
    isMember,
  );

  const itemWidth = useMemo(() => width * 0.3, [width])

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
      <View key={item.userId} style={styles.item}>
        <MaskedView isMedia containerStyle={StyleSheet.flatten([styles.maskedView, {width: itemWidth }])} newsFeed={item}>
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
        </MaskedView>
      </View>
    );
  };

  const keyExtractor = useCallback(
    (item: INewsFeedData, index: number) => `key-${index}-${item.documentId}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.listStyle}
      data={isMember ? feedList : null}
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isMember ? <Empty title="Be the first to add media to this Business pages." /> : null
      }
      ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
      ListHeaderComponent={
        <>
          {isLoading && <Spinner mb={20} mt={20} />}
          {!isLoading && (!isMember || isInviteeOfPrivateBusiness) && (
            <View style={styles.emptyComponent}>
              <Text>Please follow the business page to view media!</Text>
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
  listStyle: {paddingBottom: 50},
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
  emptyComponent: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
  },
});

export default Media;
