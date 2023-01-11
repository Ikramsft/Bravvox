/**
 * @format
 */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ProgressImage} from '../../../components/Common';
import {calculateImageHeightWidth} from '../../../utils';

import {INewsFeedData} from '../types/NewsFeedInterface';
import {VideoPlayer} from '../VideoPlayer';

interface IImageVideoProps {
  newsFeed: INewsFeedData;
  isSinglePostView: boolean | undefined;
  // eslint-disable-next-line react/require-default-props
  onOutSidePress?: () => void;
}

function ImageVideo(props: IImageVideoProps) {
  const {newsFeed, isSinglePostView, onOutSidePress} = props;
  const {contentDataType} = newsFeed;
    
  if (contentDataType === 'image' && newsFeed.imageContentLink) {
    let imageUrl = '';

    const {original, overlay, small, high} = newsFeed?.imageContentLink?.[0] || {};
    imageUrl = original || overlay || small || high || '';

    const {height, width} = calculateImageHeightWidth(imageUrl || '');
    
    return (
      <View style={styles.imageContainer}>
        <ProgressImage key={imageUrl} source={{uri: imageUrl || ''}} style={{height, width}} />
      </View>
    );
  }

  if (contentDataType === 'video' && newsFeed.videoContentLink) {
    const {videoEncodeStatus, VideoPath: path} = newsFeed.videoContentLink[0];
    if (videoEncodeStatus === 'complete') {
      return ( 
        <VideoPlayer
          isSinglePostView={isSinglePostView}
          path={path ?? ''}
          onOutSidePress={onOutSidePress}
        />
      );
    }
  }

  return null;
}

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 8,
  },
});

export default ImageVideo;
