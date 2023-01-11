/**
 * @format
 */
import React from 'react';
import {useSelector} from 'react-redux';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import {CloseIcon} from 'native-base';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';

import {RootState} from '../../redux/store';
import {useImageGallery} from './useImageGallery';
import {theme} from '../../theme';

function ImageGallery() {
  const {hideGallery} = useImageGallery();
  const {visible, imageData} = useSelector((state: RootState) => state.gallery);

  let imageUrl;
  if (imageData.length > 0) {
    imageUrl = imageData[0].uri;
  }
  if (visible) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={hideGallery}>
          <CloseIcon color={theme.colors.white} size={4} />
        </TouchableOpacity>
        <View style={styles.innerBox}>
          <ReactNativeZoomableView contentHeight={150} contentWidth={300} maxZoom={30}>
            <Image source={{uri: imageUrl}} style={styles.img} />
          </ReactNativeZoomableView>
        </View>
      </View>
    );
  }
  return null;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.black[1000],
    position: 'absolute',
    zIndex: 9999,
  },
  innerBox: {
    flexShrink: 1,
    height: '80%',
    width: '100%',
  },
  img: {width: '100%', height: '100%', resizeMode: 'contain'},
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 15,
  },
});
export default ImageGallery;
