/**
 * @format
 */

import React, {forwardRef, useImperativeHandle} from 'react';
// eslint-disable-next-line react-native/split-platform-components
import {PermissionsAndroid} from 'react-native';
import {
  Asset,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {View, Actionsheet, useDisclose, Box, Text} from 'native-base';
import {isAndroid} from '../constants/common';

const photoOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 1600,
  maxHeight: 1600,
  includeBase64: false,
};

const ImageSource = {gallery: 0, camera: 1, none: 2};

type ImageSource = 'gallery' | 'camera';
export type IAssetType = Asset;
interface IPickerProps {
  onSelectImage: (image: IAssetType) => void;
  options?: ImageLibraryOptions;
}

type IPressHandler = {
  onPickerSelect: (type?: ImageSource) => void;
};

const MediaPicker = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  useImperativeHandle(ref, () => ({onPickerSelect: onOpen}));

  const {isOpen, onOpen, onClose} = useDisclose();

  const {onSelectImage, options} = props;

  const onUseCameraPress = () => (isAndroid ? requestCameraPermission() : showCamera());

  const requestCameraPermission = async () => {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'App Camera Permission',
      message: 'App needs access to your camera ',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      showCamera();
    }
  };

  const handleResponse = async (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorCode) {
      return;
    }
    const image = response.assets?.[0];
    if (image && image?.uri && onSelectImage) {
      onSelectImage(image);
    }
  };

  const showGallery = () => {
    onClose();
    if (options) {
      launchImageLibrary(options, handleResponse);
    }
  };

  const showCamera = () => {
    onClose();
    if (options) {
      launchCamera(options, handleResponse);
    }
  };

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box justifyContent="center" px={4} py="3" w="100%">
            <Text fontFamily="heading" fontSize="20">
              Please select source:
            </Text>
          </Box>
          <Actionsheet.Item py="3" onPress={showGallery}>
            Photo Library
          </Actionsheet.Item>
          <Actionsheet.Item py="3" onPress={onUseCameraPress}>
            Use Camera
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});

MediaPicker.defaultProps = {
  options: photoOptions,
};

export type PickerHandle = React.ElementRef<typeof MediaPicker>;
export default MediaPicker;
