/**
 * @format
 */
import React from 'react';
import {IconButton, Spinner, View} from 'native-base';
import {Keyboard, Platform, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {EventRegister} from 'react-native-event-listeners';

import ReactNativeBlobUtil from 'react-native-blob-util';
import {ProgressImage} from './Common';
import MediaPicker, {IAssetType, PickerHandle} from './MediaPicker';
import {validateImage} from '../utils/validator';
import {theme} from '../theme';
import UserAvatar from './UserAvatar';
import ImageCropper, {ISavePayload} from './ImageCropper';
import {SCREEN_WIDTH} from '../constants/common';
import {getImageExtension} from '../utils';
import {PicCroppedDetails} from '../redux/reducers/user/UserInterface';

export interface ISelectFile extends Omit<ISavePayload, 'originalFile'> {
  originalFile: ISelectedMedia;
}

export interface IMedia {
  uri: string;
  name: string;
  type: string;
}

export type ImageUpdateType = 'cover' | 'avatar';

interface IAvatarCoverImageProps {
  allowGif?: boolean;
  selectFile: (payload: ISelectFile, type: ImageUpdateType) => void;
  isLoadingCover?: boolean;
  uriCover: string;
  coverMaxSize?: number;
  isLoadingAvatar?: boolean;
  uriAvatar: string;
  avatarMaxSize?: number;
  originalAvatar?: string;
  originalCover?: string;
  avatarViewAttribute?: PicCroppedDetails;
  coverViewAttribute?: PicCroppedDetails;
  isEdit?: boolean;
  onAvatarCancelPress?: () => void;
  onCoverCancelPress?: () => void;
  isCoverShow?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  avatarContainerStyle?: StyleProp<ViewStyle>;
}

interface ISelectedMedia extends IMedia {
  base64: string;
}

export const AVATAR_IMAGE_SIZE = 95;
export const COVER_IMAGE_HEIGHT = 100;

interface IIconProps extends IViewProps {
  onPress: () => void;
  icon: JSX.Element;
}

function SelectIcon(props: IIconProps) {
  const {icon, onPress, ...others} = props;
  return (
    <View
      alignContent="center"
      alignItems="center"
      bottom={2}
      justifyContent="center"
      maxHeight="36px"
      maxWidth="36px"
      position="absolute"
      right={2}
      {...others}>
      <IconButton
        backgroundColor={theme.colors.blue[500]}
        borderRadius="full"
        icon={icon}
        zIndex={9999}
        onPress={onPress}
      />
    </View>
  );
}

export function AvatarCoverImage(props: IAvatarCoverImageProps) {
  const {
    allowGif,
    isLoadingCover,
    uriCover,
    coverMaxSize,
    isLoadingAvatar,
    uriAvatar,
    avatarMaxSize,
    isEdit,
    isCoverShow,
    containerStyle,
    avatarContainerStyle,
    originalAvatar,
    originalCover,
    avatarViewAttribute,
    coverViewAttribute,
    onCoverCancelPress,
    selectFile,
    onAvatarCancelPress,
  } = props;

  const [selectedImage, setSelectedImage] = React.useState<ISelectedMedia>();
  const [cropper, setCropper] = React.useState<boolean>(false);
  const [imageBase64, setImageBase64] = React.useState<string>('');
  const [filePath, setFilePath] = React.useState<string>('');
  const [type, setType] = React.useState<ImageUpdateType>('avatar');

  const mediaPicker = React.useRef<PickerHandle>(null);

  const {uriArr2: fileExtension, filename: getFileName} = getImageExtension(
    (type === 'avatar' ? originalAvatar : originalCover) || '',
  );

  const toggleCropper = () => {
    setCropper(v => {
      if (v) {
        setSelectedImage(undefined);
        setImageBase64('');
        setFilePath('');
      }
      return !v;
    });
  };

  const convert = (convertImageType: ImageUpdateType) => {
    try {
      const link = convertImageType === 'avatar' ? originalAvatar : originalCover;
      ReactNativeBlobUtil.fetch('GET', link || '')
        .then(res => {
          const {status} = res.info();
          if (status === 200) {
            const base64Str = res.base64();
            setImageBase64(base64Str);
          }
        })
        .catch(error => {
          console.log('-----> error', error);
        });

      ReactNativeBlobUtil.config({fileCache: true, appendExt: fileExtension})
        .fetch('GET', link || '')
        .then(res => {
          setFilePath(Platform.OS === 'android' ? `file://${res.path()}` : `${res.path()}`);
        })
        .catch(error => {
          console.log('-----> error', error);
        });
    } catch (err) {
      console.log('-----> err', err);
    }
  };

  const onPressAvatar = () => {
    EventRegister.emit('keyboardDismiss', 'yes');
    Keyboard.dismiss();
    setType('avatar');
    // mediaPicker.current?.onPickerSelect();
    if (uriAvatar) {
      toggleCropper();
      convert('avatar');
    } else {
      mediaPicker.current?.onPickerSelect();
    }
  };

  const onPressCover = () => {
    EventRegister.emit('keyboardDismiss', 'yes');
    Keyboard.dismiss();
    setType('cover');
    if (uriCover) {
      toggleCropper();
      convert('cover');
    } else {
      mediaPicker.current?.onPickerSelect();
    }
  };

  const onSelectImage = (file: IAssetType) => {
    if (file) {
      const {
        fileName: name = '',
        type: fileType = '',
        uri = '',
        fileSize: size = 0,
        base64 = '',
      } = file;

      if (name && fileType) {
        const allowedTypes = allowGif ? /(\.jpg|\.jpeg|\.gif|\.png)$/i : /(\.jpg|\.jpeg|\.png)$/i;
        const maxSize = type === 'avatar' ? avatarMaxSize : coverMaxSize;
        const validated = validateImage(name, fileType, size, maxSize!, allowedTypes);
        if (validated) {
          const b64 = `data:${fileType};base64,${base64}`;
          const sFile = {uri, type: fileType, name, base64: b64};
          setSelectedImage(sFile);

          if (!uriAvatar || !uriCover) {
            setCropper(true);
          }
        }
      }
    }
  };

  const handleSave = (data: ISavePayload) => {
    toggleCropper();
    if (selectedImage) {
      selectFile({...data, originalFile: selectedImage}, type);
      setSelectedImage(undefined);
    } else {
      const selectImageObjects = {
        base64: `data:image/${fileExtension};base64,${imageBase64}`,
        name: getFileName,
        type: `image/${fileExtension}`,
        uri: filePath,
      };

      selectFile({...data, originalFile: selectImageObjects}, type);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <ImageCropper
        enableZoom
        allowGif={allowGif}
        aspectRatio={type === 'cover' ? 4 : 1}
        avatarMaxSize={avatarMaxSize}
        avatarViewAttribute={!selectedImage ? avatarViewAttribute : undefined}
        coverMaxSize={coverMaxSize}
        coverViewAttribute={!selectedImage ? coverViewAttribute : undefined}
        handleClose={toggleCropper}
        handleSave={handleSave}
        image={
          selectedImage
            ? selectedImage?.base64 || ''
            : imageBase64
            ? `data:image/${fileExtension};base64,${imageBase64}`
            : ''
        }
        initialAspectRatio={type === 'cover' ? 4 / 1 : 1 / 1}
        open={cropper}
        rounded={type !== 'cover'}
        selectedType={type}
        selectFile={onSelectImage}
      />
      {isCoverShow && (
        <View style={styles.coverView}>
          <ProgressImage key={uriCover} source={{uri: uriCover}} style={styles.coverImage} />
          {isLoadingCover && (
            <Spinner bottom={60} color={theme.colors.black[400]} position="absolute" />
          )}
          {!isEdit && onCoverCancelPress && uriCover ? (
            <SelectIcon
              icon={<AntDesign color={theme.colors.white} name="close" size={10} />}
              onPress={onCoverCancelPress}
            />
          ) : (
            <SelectIcon
              icon={<AntDesign color={theme.colors.white} name="picture" size={13} />}
              onPress={onPressCover}
            />
          )}
        </View>
      )}
      <View style={avatarContainerStyle || styles.avatarView}>
        <UserAvatar
          borderColor={theme.colors.white}
          borderWidth={2}
          profilePic={uriAvatar}
          size={AVATAR_IMAGE_SIZE}
        />
        {isLoadingAvatar && (
          <Spinner bottom={33} color={theme.colors.black[400]} position="absolute" />
        )}
        {!isEdit && onAvatarCancelPress && uriAvatar ? (
          <SelectIcon
            bottom={0}
            icon={<AntDesign color={theme.colors.white} name="close" size={10} />}
            right={0}
            onPress={onAvatarCancelPress}
          />
        ) : (
          <SelectIcon
            bottom={0}
            icon={<Feather color={theme.colors.white} name="camera" size={12} />}
            right={0}
            onPress={onPressAvatar}
          />
        )}
      </View>
      <MediaPicker
        options={{mediaType: 'photo', includeBase64: true}}
        ref={mediaPicker}
        onSelectImage={onSelectImage}
      />
    </View>
  );
}

AvatarCoverImage.defaultProps = {
  allowGif: true,
  isLoadingCover: false,
  isLoadingAvatar: false,
  isEdit: false,
  coverMaxSize: 100,
  avatarMaxSize: 100,
  onAvatarCancelPress: null,
  onCoverCancelPress: null,
  isCoverShow: true,
  containerStyle: undefined,
  avatarContainerStyle: undefined,
  originalAvatar: undefined,
  originalCover: undefined,
  avatarViewAttribute: undefined,
  coverViewAttribute: undefined,
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 50,
    flex: 1,
    overflow: 'visible',
  },
  coverView: {
    backgroundColor: theme.colors.purple[500],
  },
  coverImage: {
    width: SCREEN_WIDTH,
    height: COVER_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  avatarView: {
    position: 'absolute',
    width: AVATAR_IMAGE_SIZE,
    height: AVATAR_IMAGE_SIZE,
    top: COVER_IMAGE_HEIGHT / 2,
    left: (SCREEN_WIDTH - AVATAR_IMAGE_SIZE) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
