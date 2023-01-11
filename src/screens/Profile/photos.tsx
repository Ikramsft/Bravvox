import React, {useCallback, useState, useMemo} from 'react';
import {StyleSheet, Image, TouchableOpacity, ListRenderItem, useWindowDimensions} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {View, Spinner, Text} from 'native-base';
import {ProfileScreenProps} from '.';
import {useProfileMedia} from './Queries/useProfileMedia';
import {GalleryIcon, RestrictedContentEyeIcon} from '../../assets/svg';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import {theme} from '../../theme';
import MaskedView from '../Home/NewsFeed/MaskedView';

const RESTRICTED_MEDIA_BACKGROUD_COLOR = 'rgba(39,50,62,.93)';
interface IPhotosProps extends ProfileScreenProps {
  userId: string;
}

function Photos(props: IPhotosProps) {
  const {width} = useWindowDimensions();
  const {userId, navigation} = props;
  const {feedList, isLoading, refetch, isFetchingNextPage, onEndReached} = useProfileMedia(userId);
  const [documentId, setDocumentId] = useState('');

  const itemWidth = useMemo(() => width * 0.3, [width])

  const renderPhotoItem: ListRenderItem<INewsFeedData> = ({item}) => {
    setDocumentId(item?.documentId);
    const isImage = item.contentDataType === 'image';
    let imageUrl = '';
    if (isImage) {
      const {original, overlay, small} = item?.imageContentLink?.[0] || {};
      imageUrl = original || overlay || small || '';
    }

    return (
      <MaskedView isMedia containerStyle={StyleSheet.flatten([styles.maskedView, {width: itemWidth }])} newsFeed={item}>
        <TouchableOpacity
        key={item.userId}
        style={[
          styles.item,
          item.contentStatus === 'SUSPENDED' && {backgroundColor: RESTRICTED_MEDIA_BACKGROUD_COLOR},
        ]}
        onPress={() => {
          navigation.navigate('SinglePost', {
            documentId: item.documentId,
            userName: item.userInfo.userName,
            from: 'profile',
            isMember: true,
            feedData: item
          });
        }}>
        {item?.contentStatus !== 'SUSPENDED' && (
          <Image source={{uri: imageUrl}} style={styles.img} />
        )}

        {item?.imageContentLink?.length > 1 && (
          <TouchableOpacity style={styles.btn}>
            <GalleryIcon />
          </TouchableOpacity>
        )}

        {item?.contentStatus === 'SUSPENDED' ? (
          <View
            alignItems="center"
            height={120}
            justifyContent="center"
            justifyItems="center"
            position="absolute"
            width="100%">
            <RestrictedContentEyeIcon color="white" height={15} width={25} />
          </View>
        ) : (
          <Image source={{uri: imageUrl}} style={styles.img} />
        )}
      </TouchableOpacity>
      </MaskedView>
    );
  };

  const emptyComponent = () => {
    return (
      <View style={styles.emptyComponent}>
        <Text>No Photos Found.</Text>
      </View>
    );
  };

  const keyExtractor = useCallback(
    (item: INewsFeedData, index: number) => `key-${index}-${item.userId}`,
    [],
  );

  return (
    <Tabs.FlatList
      contentContainerStyle={styles.flatContainer}
      data={feedList}
      keyboardShouldPersistTaps="handled"
      keyExtractor={keyExtractor}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={isFetchingNextPage ? <Spinner mb={20} mt={20} /> : null}
      ListHeaderComponent={isLoading ? <Spinner mb={20} mt={20} /> : null}
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
  },
  emptyComponent: {
    minHeight: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Photos;
