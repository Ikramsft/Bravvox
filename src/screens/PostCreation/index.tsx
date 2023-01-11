import {Image, Text, View, Spinner, Actionsheet, useDisclose, ScrollView} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  Platform,
  Keyboard,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';
import {KeyboardAccessoryView} from 'react-native-keyboard-accessory';

import {PostCreationTypeFrom, RootStackParamList} from '../../navigation';
import MediaPicker, {IAssetType, PickerHandle} from '../../components/MediaPicker';
import {validateImage, validateVideo, getVideoExtension} from '../../utils/validator';
import {theme} from '../../theme';
import {RenderError} from '../../components/FloatingInput';
import {IUserData} from '../../redux/reducers/user/UserInterface';
import UserAvatar from '../../components/UserAvatar';
import {showSnackbar} from '../../utils/SnackBar';
import {useCreatePost} from './Queries/useCreatePost';
import {VideoPlayer} from '../Home/VideoPlayer';
import useUserInfo from '../../hooks/useUserInfo';
import {Title} from '../../components/Typography';
import {useConfirmModal} from '../../components/CofirmationModel';
import {convertTextToHtmlForNewsFeed} from '../../constants/common';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {calculateHeightWidth} from '../../utils';

interface BoxProps extends Props {
  formikProps: FormikProps<MyFormValues>;
  user: IUserData;
  title: string;
}

export interface IMedia {
  uri: string;
  name: string;
  type: string;
  height?: number;
  width?: number;
}

interface MyFormValues {
  textContent: string;
  mediaContent: IMedia;
  shareWith: string;
}

interface ButtonProps extends Props {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  spinnerLoader: boolean;
  submitEnable: boolean;
  from: PostCreationTypeFrom;
}

type Props = NativeStackScreenProps<RootStackParamList, 'NewPost'>;

const disablePublicOption: PostCreationTypeFrom[] = ['groups'];

function BottomBar(props: ButtonProps) {
  const {setFieldValue, handleSubmit, spinnerLoader, submitEnable, from} = props;

  const {isOpen, onOpen, onClose} = useDisclose();

  const mediaPicker = React.useRef<PickerHandle>(null);
  const onSelectImage = (file: IAssetType) => {
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    const fileType: string = file.type!;
    const fileSize: number = file.fileSize!;
    const fileUri: string = file.uri!;
    const fileHeight: number = file.height!;
    const fileWidth: number = file.width!;

    if (fileType.includes('video')) {
      if (validateVideo(fileType, fileSize)) {
        const extension = getVideoExtension(fileType);
        const name = new Date().getTime();
        const fileName = `${name}.${extension}`;
        setFieldValue('mediaContent', {uri: fileUri, type: fileType, name: fileName});
      }
    } else if (fileType.includes('image')) {
      const fileName: string = file.fileName!;
      const allowedSize = 100;
      if (validateImage(fileName, fileType, fileSize, allowedSize)) {
        setFieldValue('mediaContent', {
          uri: fileUri,
          type: fileType,
          name: fileName,
          height: fileHeight,
          width: fileWidth,
        });
      }
    }
  };

  const selectAddMedia = () => {
    mediaPicker.current?.onPickerSelect();
    Keyboard.dismiss();
  };

  const selectPublic = () => {
    onOpen();
    Keyboard.dismiss();
  };

  const onSelect = (text: string) => () => {
    setFieldValue('shareWith', text);
    onClose();
  };

  const style: StyleProp<TextStyle> = {
    color: !submitEnable ? theme.colors.black[400] : theme.colors.blue[400],
  };

  const showPublic = !disablePublicOption.includes(from);

  return (
    <KeyboardAccessoryView
      alwaysVisible
      androidAdjustResize
      avoidKeyboard
      style={{backgroundColor: theme.colors.appWhite['600']}}>
      <View style={styles.bottomComponent}>
        <View style={styles.leftBottomComponent}>
          <TouchableOpacity style={styles.bottomIcon} onPress={selectAddMedia}>
            <Icon color="#A9A9A9" name="camera" size={22} style={styles.imageIconStyle} />
            <Text px="1">Add Media</Text>
          </TouchableOpacity>
          {showPublic && (
            <TouchableOpacity style={styles.bottomIcon} onPress={selectPublic}>
              <Icon color="#A9A9A9" name="eye" size={22} style={styles.imageIconStyle} />
              <Text px="1">Public</Text>
            </TouchableOpacity>
          )}
        </View>
        <View height={30} width={30}>
          <TouchableOpacity disabled={!submitEnable} onPress={() => handleSubmit()}>
            <View alignItems="center" justifyContent="center">
              {spinnerLoader ? (
                <Spinner alignSelf="center" color="#959699" />
              ) : (
                <Ionicon name="send-outline" size={22} style={style} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <MediaPicker options={{mediaType: 'mixed'}} ref={mediaPicker} onSelectImage={onSelectImage} />
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Actionsheet.Item py="3" onPress={onSelect('Public')}>
            Public
          </Actionsheet.Item>
          <Actionsheet.Item py="3" onPress={onSelect('Public')}>
            Followers and Subscribers
          </Actionsheet.Item>
          <Actionsheet.Item py="3" onPress={onSelect('Public')}>
            Subscribers Only
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </KeyboardAccessoryView>
  );
}

interface ICloseProps {
  uri: string;
  onRemove: (() => void) | undefined;
  // eslint-disable-next-line react/no-unused-prop-types
  imgHeight: number;
  // eslint-disable-next-line react/no-unused-prop-types
  imgWidth: number;
}

function ImageComponent(props: ICloseProps) {
  const {uri, onRemove, imgHeight, imgWidth} = props;

  const {width, height} = calculateHeightWidth(imgHeight, imgWidth, 0.8);

  return (
    <View style={styles.imageView}>
      <Image alt="ImageName" height={height} resizeMode="contain" source={{uri}} width={width} />
      <TouchableOpacity style={styles.imageClose} onPress={onRemove}>
        <Ionicon color={theme.colors.black[500]} name="ios-close-circle" size={30} />
      </TouchableOpacity>
    </View>
  );
}

function VideoComponent(props: ICloseProps) {
  const {uri, onRemove} = props;
  return (
    <View alignSelf="center" height={400} width="90%">
      <VideoPlayer isSinglePostView={undefined} path={uri} />
      <TouchableOpacity style={styles.videoClose} onPress={onRemove}>
        <Ionicon color={theme.colors.black[500]} name="ios-close-circle" size={30} />
      </TouchableOpacity>
    </View>
  );
}

function ContentEditor(props: BoxProps) {
  const {formikProps, user, title} = props;
  const {values, setFieldValue, errors} = formikProps;

  const onRemove = () =>
    setFieldValue('mediaContent', {name: '', type: '', uri: '', height: 0, width: 0});

  const onTextChange = (value: string) => {
    if (value.replace(/\s/g, '').length) {
      setFieldValue('textContent', value);
    } else {
      setFieldValue('textContent', '');
    }
  };
  let numOfLinesGrow = 5;
  return (
    <ScrollView showsHorizontalScrollIndicator={false} style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.textComponent}>
          <UserAvatar
            influencerStatus={user.influencerStatus}
            profilePic={user.profileCroppedPic}
          />
          <View style={styles.userNameContent}>
            <Title ml={2} numberOfLines={1}>
              {user.name}
            </Title>
          </View>
        </View>
        <View paddingX={5}>
          <TextInput
            multiline
            maxLength={1000}
            numberOfLines={numOfLinesGrow}
            placeholder={
              title ? `Post to ${title}` : `What's up, ${user.name}? Write something brave!`
            }
            style={styles.textContent}
            textAlignVertical="top"
            value={values.textContent}
            onChangeText={onTextChange}
            onContentSizeChange={e => {
              numOfLinesGrow = e.nativeEvent.contentSize.height;
            }}
          />
        </View>
        {errors.textContent && <RenderError error={errors.textContent} ml={3} />}
        {values.mediaContent?.uri ? (
          <View style={styles.mideaContentView}>
            {values.mediaContent?.type.includes('image') ? (
              <ImageComponent
                imgHeight={values.mediaContent?.height || 0}
                imgWidth={values.mediaContent?.width || 0}
                uri={values.mediaContent?.uri}
                onRemove={onRemove}
              />
            ) : (
              <VideoComponent
                imgHeight={values.mediaContent?.height || 0}
                imgWidth={values.mediaContent?.width || 0}
                uri={values.mediaContent?.uri}
                onRemove={onRemove}
              />
            )}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function HeaderButton({handleSubmit, navigation}: any) {
  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={handleSubmit} />;
    navigation.setOptions({headerLeft});
  }, [navigation, handleSubmit]);
  return null;
}

function PostCreation(props: Props) {
  const {navigation, route} = props;
  const {user} = useUserInfo();
  const {uploadData, isLoading} = useCreatePost(user.documentId, route.params);
  const confirm = useConfirmModal();
  const {onClose} = useDisclose();

  const schema = Yup.object().shape({
    textContent: Yup.string().max(
      route.params.from === 'events' ? 3000 : 1000,
      'Your post exceeds the maximum limit of 1000 characters. Please revise and try again.',
    ),
    mediaContent: Yup.object().shape({}),
  });

  React.useLayoutEffect(() => {
    let pageTitle = '';
    switch (route.params.from) {
      case 'groups':
        pageTitle = 'Write Group Post';
        break;
      case 'business':
        pageTitle = 'Write Business Post';
        break;
      case 'home':
      default:
        pageTitle = 'Write a Post';
        break;
    }
    const headerTitle = () => <HeaderTitle title={pageTitle} />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
    });
  }, [navigation, route.params.from]);

  const onCreateContent = async (values: any) => uploadData(values);

  const backHandler = (values: MyFormValues) => {
    if (values.textContent.trim().length !== 0 || values.mediaContent.uri !== '') {
      onClose();
      confirm?.show?.({
        title: <Title fontSize={18}>Leave Post</Title>,
        message: (
          <Text>
            <Text>Are you sure you want to leave?</Text>
          </Text>
        ),
        onConfirm: () => {
          navigation.goBack();
          onClose();
        },
        submitLabel: 'YES',
        cancelLabel: 'CANCEL',
      });
    } else {
      navigation.goBack();
    }
  };

  const createFormData = (values: MyFormValues) => {
    const formData = new FormData();
    if (values.mediaContent.uri !== '' || values.textContent !== '') {
      if (values.mediaContent?.uri) {
        const dataType = values.mediaContent.type.includes('video') ? 'video' : 'image';
        formData.append('mediaContent', values.mediaContent);
        formData.append('contentDataType', dataType);
        if (values.textContent) {
          const textContent = convertTextToHtmlForNewsFeed(values.textContent);
          formData.append('textContent', textContent);
        }
      } else {
        const textContent = convertTextToHtmlForNewsFeed(values.textContent);
        formData.append('textContent', textContent);
        formData.append('contentDataType', 'text');
      }
      formData.append('shareWith', values.shareWith.toLowerCase());
      onCreateContent(formData);
    } else {
      showSnackbar({message: 'Please enter at least one image or text.'});
    }
  };

  const initialValues: MyFormValues = {
    textContent: '',
    mediaContent: {uri: '', name: '', type: '', height: 0, width: 0},
    shareWith: 'Public',
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validateOnChange={false}
        validationSchema={schema}
        onSubmit={createFormData}>
        {formikProps => {
          const {setFieldValue, handleSubmit, values} = formikProps;
          const submitEnable =
            values.textContent.trim().length !== 0 || values.mediaContent.uri !== '';
          return (
            <>
              <ContentEditor {...props} {...{formikProps}} title={route.params.title} user={user} />
              <BottomBar
                {...props}
                {...{formikProps}}
                from={route.params.from}
                handleSubmit={handleSubmit}
                setFieldValue={setFieldValue}
                spinnerLoader={isLoading}
                submitEnable={submitEnable}
              />
              <HeaderButton handleSubmit={() => backHandler(values)} navigation={navigation} />
            </>
          );
        }}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
  },
  imageClose: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 30,
    height: 30,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
  },
  videoClose: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 30,
    height: 30,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    zIndex: 9999,
  },
  userNameContent: {alignSelf: 'center'},
  textContent: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'DMSANS-Regular',
    marginTop: Platform.select({ios: 7, android: 0}),
  },
  textComponent: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  imageView: {
    marginTop: 15,
    width: '80%',
    alignSelf: 'center',
  },
  bottomComponent: {
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  mideaContentView: {
    height: '75%',
  },
  leftBottomComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  imageIconStyle: {
    marginRight: 5,
  },
  bottomIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PostCreation;
