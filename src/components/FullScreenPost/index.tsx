/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {ActivityIndicator, StyleSheet} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Orientation from 'react-native-orientation';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import {VideoPlayer} from '../../screens/Home/VideoPlayer';
import {INewsFeedData} from '../../screens/Home/types/NewsFeedInterface';
import FooterComponent from './FooterComponent';
import HeaderComponent from './HeaderComponent';
import {useFullScreenPost} from './useFullScreenPost';
import {useSingleNewsFeedPost} from '../../screens/SinglePost/useSingleNewsFeed';

const loadingRender = () => <ActivityIndicator />;

function FullScreenPost() {
  const {visible, fullScreenPost, id, from, isMember, userName} = useSelector(
    (state: RootState) => state.fullScreenPostReducer,
  );
  const {hidePost} = useFullScreenPost();
  const [hideComponent, setHideComponent] = React.useState<boolean>(false);
  React.useEffect(() => {
    // if (!fullScreenPost) {
    //   setHideComponent(false);
    //   Orientation.lockToPortrait();
    // } else {
    //   Orientation.unlockAllOrientations();
    // }
  }, [fullScreenPost]);

  const feed = fullScreenPost as INewsFeedData;
  
  const {feedData, commentsList, onEndReached, isFetchingNextPage} = useSingleNewsFeedPost(
    feed?.documentId,
    from,
    userName,
    id,
  );

  const mediaTypeImage = feedData?.contentDataType === 'image' && feedData?.imageContentLink;
  const mediaTypeVideo = feedData?.contentDataType === 'video' && feedData?.videoContentLink;
  const {videoEncodeStatus, VideoPath: path} = mediaTypeVideo
    ? feedData.videoContentLink[0]
    : {videoEncodeStatus: false, VideoPath: ''};
  const src = mediaTypeImage ? feedData.imageContentLink[0]?.original : '';

  if (visible) {
    return (
      <View style={styles.container}>
        {mediaTypeImage ? (
          <ImageViewer
            enableSwipeDown
            doubleClickInterval={400}
            imageUrls={[{url: src || ''}]}
            index={0}
            loadingRender={loadingRender}
            renderIndicator={() => <View />}
            onClick={() => setHideComponent(!hideComponent)}
            onSwipeDown={hidePost}
          />
        ) : (
          videoEncodeStatus === 'complete' && <VideoPlayer isSinglePostView={undefined} path={path??''} />
        )}
        {hideComponent && <HeaderComponent feedData={feedData} from={from} isMember={isMember} />}
        {hideComponent && (
          <FooterComponent
            commentsList={commentsList}
            feedData={feedData}
            from={from}
            id={id}
            isFetchingNextPage={isFetchingNextPage}
            isMember={isMember}
            onEndReached={onEndReached}
          />
        )}
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});

export default FullScreenPost;
