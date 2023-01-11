import {View, IconButton, Heading, Button, Spinner, Modal} from 'native-base';
import Slider from '@react-native-community/slider';
import React, {useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
// import  from 'react-native-modal';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';
import {theme} from '../../theme';
import MediaPicker, {PickerHandle} from '../MediaPicker';

import CropperContainer, {
  ICropperHandler,
  ICropperImageData,
  SavePayload,
} from './CropperContainer';
import {PicCroppedDetails} from '../../redux/reducers/user/UserInterface';

export interface ISavePayload extends SavePayload {
  zoom: number;
  minZoom: number;
  originalFile: string;
}

type IProps = {
  open: boolean;
  handleClose: () => void;
  handleSave: (data: ISavePayload) => void;
  image: string;
  aspectRatio: number;
  initialAspectRatio: number;
  enableZoom: boolean | undefined;
  rounded: boolean | undefined;
  allowGif: boolean | undefined;
  coverMaxSize: number | undefined;
  avatarMaxSize: number | undefined;
  selectFile: any;
  selectedType: string;
  avatarViewAttribute?: PicCroppedDetails;
  coverViewAttribute?: PicCroppedDetails;
};

type IHeaderProps = {
  handleClose: () => void;
};

type IImageData = {
  minZoom: number;
  zoom: number;
  isReady: boolean;
};

function HeaderButton(props: IHeaderProps) {
  const {handleClose} = props;

  return (
    <View
      bg={theme.colors.appWhite[600]}
      left={0}
      pb={1}
      position="absolute"
      top={0}
      width="100%"
      zIndex={9}>
      <View style={styles.headingContainer}>
        <Heading size="lg">Edit</Heading>
        <IconButton
          _icon={{
            as: MaterialCommunityIcons,
            name: 'close',
            size: 6,
          }}
          borderRadius="full"
          size={7}
          style={styles.closeButton}
          variant="solid"
          onPress={handleClose}
        />
      </View>
    </View>
  );
}

function ImageCropper(props: IProps) {
  const {
    open,
    enableZoom,
    handleClose,
    handleSave,
    rounded = false,
    avatarViewAttribute,
    coverViewAttribute,
    selectedType,
    selectFile,
    image,
    ...rest
  } = props;
  const cropperRef = useRef<ICropperHandler>(null);
  const mediaPicker = React.useRef<PickerHandle>(null);

  const [imageData, setImageData] = useState<IImageData>({minZoom: 0, zoom: 0, isReady: false});

  const onSave = (croppedPayload: SavePayload) => {
    const {zoom, minZoom} = imageData;

    const data = {...croppedPayload, originalFile: image, zoom, minZoom};
    handleSave(data);
  };

  const onReady = (payload: ICropperImageData) => {
    if (selectedType === 'avatar' && avatarViewAttribute) {
      setImageData({
        isReady: true,
        minZoom: avatarViewAttribute.minZoom ?? 0,
        zoom: avatarViewAttribute.zoom ?? 0,
      });
    } else if (selectedType === 'cover' && coverViewAttribute) {
      setImageData({
        isReady: true,
        minZoom: coverViewAttribute.minZoom ?? 0,
        zoom: coverViewAttribute.zoom ?? 0,
      });
    } else {
      const calculated = Math.floor((payload.width / payload.naturalWidth) * 10);
      const zoomValue = Math.floor((calculated + (calculated + 10)) / 2);
      setImageData({isReady: true, minZoom: calculated, zoom: zoomValue});
    }
  };

  const handleZoom = (value: number) => setImageData({...imageData, zoom: value});

  const showSpinner = !image || !imageData.isReady;

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      // eslint-disable-next-line react-native/no-inline-styles
      style={[styles.safeAreaContainer, {opacity: !showSpinner ? 1 : 0}]}>
      <View>
        {open ? (
          <Modal isOpen={open} style={styles.modal}>
            {showSpinner ? (
              <View style={styles.spinnerContainer}>
                <Spinner size="lg" />
              </View>
            ) : null}
            <>
              <View style={styles.contentContainer}>
                <View style={styles.container}>
                  <HeaderButton handleClose={handleClose} />
                  <CropperContainer
                    {...rest}
                    modal
                    autoCropArea={1}
                    background={false}
                    center={false}
                    cropBoxMovable={false}
                    cropBoxResizable={false}
                    cropperAttributes={
                      selectedType === 'avatar' ? avatarViewAttribute : coverViewAttribute
                    }
                    dragMode="move"
                    guides={false}
                    image={image}
                    ref={cropperRef}
                    restore={false}
                    rounded={rounded}
                    toggleDragModeOnDblclick={false}
                    viewMode={1}
                    zoom={imageData.zoom / 10}
                    zoomOnTouch={false}
                    zoomOnWheel={false}
                    onReady={onReady}
                    onSave={onSave}
                  />
                </View>
              </View>

              <View bg="#fff" bottom={0} position="absolute" width="100%">
                {enableZoom ? (
                  <View style={styles.zoomContainer}>
                    <IconButton
                      _icon={{
                        as: MaterialCommunityIcons,
                        name: 'zoom-out',
                        size: 6,
                      }}
                      disabled={imageData.zoom === imageData.minZoom}
                      size={7}
                      style={styles.closeButton}
                      variant="solid"
                      onPress={() => handleZoom(imageData.zoom - 1)}
                    />
                    <View style={styles.sliderContainer}>
                      <Slider
                        accessibilityLabel="Image Zoom"
                        maximumValue={imageData.minZoom + 10}
                        minimumValue={imageData.minZoom}
                        step={1}
                        value={imageData.zoom}
                        onSlidingComplete={handleZoom}
                      />
                    </View>
                    <IconButton
                      _icon={{
                        as: MaterialCommunityIcons,
                        name: 'zoom-in',
                        size: 6,
                      }}
                      disabled={imageData.zoom === imageData.minZoom + 10}
                      size={7}
                      style={styles.closeButton}
                      variant="solid"
                      onPress={() => handleZoom(imageData.zoom + 1)}
                    />
                  </View>
                ) : null}
                <View style={styles.actionContainer}>
                  <Button
                    colorScheme="grey"
                    style={styles.button}
                    variant="outline"
                    onPress={() => mediaPicker.current?.onPickerSelect()}>
                    Change Image
                  </Button>
                  <Button
                    style={styles.button}
                    variant="outline"
                    onPress={cropperRef?.current?.applyImage}>
                    Save
                  </Button>
                  <MediaPicker
                    options={{mediaType: 'photo', includeBase64: true}}
                    ref={mediaPicker}
                    // main file select func
                    onSelectImage={selectFile}
                  />
                </View>
              </View>
            </>
          </Modal>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeAreaContainer: {
    flexGrow: 1,
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
  },
  // eslint-disable-next-line react-native/no-color-literals
  modal: {
    margin: 0,
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  contentContainer: {
    flexGrow: 1,
    position: 'relative',
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomContainer: {
    marginTop: 25,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    bottom: 15,
  },
  sliderContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  button: {
    width: '40%',
  },
});

ImageCropper.defaultProps = {
  avatarViewAttribute: undefined,
  coverViewAttribute: undefined,
};

export default ImageCropper;
