import {
  Divider,
  Image,
  Text,
  View,
  Spinner,
  Actionsheet,
  useDisclose,
  KeyboardAvoidingView,
  ScrollView,
} from 'native-base';
import React from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StyleProp,
  TextStyle,
  Platform,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Formik, FormikProps} from 'formik';
import * as Yup from 'yup';

import {PostCreationTypeFrom, RootStackParamList} from '../../navigation';
import MediaPicker, {IAssetType, PickerHandle} from '../../components/MediaPicker';
import {validateImage, validateVideo, getVideoExtension} from '../../utils/validator';
import {theme} from '../../theme';
import {RenderError} from '../../components/FloatingInput';
import {IUserData} from '../../redux/reducers/user/UserInterface';
import UserAvatar from '../../components/UserAvatar';
import {showSnackbar} from '../../utils/SnackBar';
import {VideoPlayer} from '../Home/VideoPlayer';
import useUserInfo from '../../hooks/useUserInfo';
import {Title} from '../../components/Typography';
import {useConfirmModal} from '../../components/CofirmationModel';
import {INewsFeedData} from '../Home/types/NewsFeedInterface';
import {useEditPost} from './Queries/useEditPost';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {convertTextToHtmlForNewsFeed, processContentString} from '../../constants/common';
import {truncateUsername} from '../../utils';

interface BoxProps extends Props {
  formikProps: FormikProps<MyFormValues>;
  user: IUserData;
  title: string;
}

export interface IMedia {
  uri: string;
  name: string;
  type: string;
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

const schema = Yup.object().shape({
  textContent: Yup.string().max(
    1000,
    'Your post exceeds the maximum limit of 1000 characters. Please revise and try again.',
  ),
  mediaContent: Yup.object().shape({}),
});

type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

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
        setFieldValue('mediaContent', {uri: fileUri, type: fileType, name: fileName});
      }
    }
  };

  const selectAddMedia = () => mediaPicker.current?.onPickerSelect();

  const onSelect = (text: string) => () => {
    setFieldValue('shareWith', text);
    onClose();
  };

  const style: StyleProp<TextStyle> = {opacity: submitEnable ? 1 : 0.5};

  const showPublic = !disablePublicOption.includes(from);

  return (
    <>
      <Divider my={3} />
      <View style={styles.bottomComponent}>
        <View style={styles.leftBottomComponent}>
          <TouchableOpacity style={styles.bottomIcon} onPress={selectAddMedia}>
            <Icon color="#A9A9A9" name="camera" size={22} style={styles.imageIconStyle} />
            <Text px="1">Add Media</Text>
          </TouchableOpacity>
          {showPublic && (
            <TouchableOpacity style={styles.bottomIcon} onPress={onOpen}>
              <Icon color="#A9A9A9" name="settings" size={22} style={styles.imageIconStyle} />
              <Text px="1">Public</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity disabled={!submitEnable} onPress={() => handleSubmit()}>
          <View alignItems="center" height={10} justifyContent="center" width={50}>
            {spinnerLoader ? (
              <Spinner alignSelf="center" color="#959699" />
            ) : (
              <Ionicon color="#A9A9A9" name="send-outline" size={25} style={style} />
            )}
          </View>
        </TouchableOpacity>
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
    </>
  );
}

interface ICloseProps {
  uri: string;
  onRemove: (() => void) | undefined;
}

function ImageComponent(props: ICloseProps) {
  const {uri, onRemove} = props;
  return (
    <>
      <Image alt="ImageName" source={{uri}} style={styles.imageComponent} />
      <View style={styles.imageClose}>
        <Ionicon
          color={theme.colors.black[500]}
          name="ios-close-circle"
          size={30}
          onPress={onRemove}
        />
      </View>
    </>
  );
}

function VideoComponent(props: ICloseProps) {
  const {uri, onRemove} = props;
  return (
    <View alignSelf="center" height={400} width="90%">
      <VideoPlayer path={uri} />
      <View style={styles.vieoClose}>
        <Ionicon
          color={theme.colors.black[500]}
          name="ios-close-circle"
          size={30}
          onPress={onRemove}
        />
      </View>
    </View>
  );
}

function ContentEditor(props: BoxProps) {
  const {formikProps, user, title} = props;
  const {values, setFieldValue, errors} = formikProps;

  const onRemove = () => setFieldValue('mediaContent', {name: '', type: '', uri: ''});

  const onTextChange = (value: string) => {
    if (value.replace(/\s/g, '').length) {
      setFieldValue('textContent', value);
    } else {
      setFieldValue('textContent', '');
    }
  };

  return (
    <ScrollView showsHorizontalScrollIndicator={false} style={styles.mainContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.textComponent}>
          <UserAvatar profilePic={user.profilePic} />
          <View>
            <Text ml={2}>{user.name} </Text>
            <Text color={theme.colors.gray[600]} fontSize={12} ml={2}>
              @{truncateUsername(user.userName)}{' '}
            </Text>
          </View>
        </View>
        <View paddingX={5}>
          <TextInput
            multiline
            maxLength={1000}
            numberOfLines={5}
            placeholder={
              title ? `Post to ${title}` : `What's up, ${truncateUsername(user.userName)}? Write something brave!`
            }
            style={styles.textContent}
            textAlignVertical="top"
            value={values.textContent}
            onChangeText={onTextChange}
          />
        </View>
        {errors.textContent && <RenderError error={errors.textContent} ml={3} />}
        {values.mediaContent?.uri ? (
          <View style={styles.mediaContentView}>
            {values.mediaContent?.type.includes('image') ? (
              <ImageComponent uri={values.mediaContent?.uri} onRemove={onRemove} />
            ) : (
              <VideoComponent uri={values.mediaContent?.uri} onRemove={onRemove} />
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

function EditPost(props: Props) {
  const {navigation, route} = props;
  const newsFeed = route.params.newsFeed as INewsFeedData;
  const {user} = useUserInfo();
  const userData = user as IUserData;
  const {editData, isLoading} = useEditPost(userData.documentId, route.params);

  const confirm = useConfirmModal();
  const {onClose} = useDisclose();

  React.useLayoutEffect(() => {
    let pageTitle = '';
    console.log(route.params.from);
    switch (route.params.from) {
      case 'group':
      case 'groups':
        pageTitle = 'Edit Group Post';
        break;
      case 'business':
        pageTitle = 'Edit Business Post';
        break;
      case 'home':
      default:
        pageTitle = 'Edit Post';
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

  const onEditContent = async (values: any) => editData(values);

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

  const editFormData = (values: MyFormValues) => {
    const formData = new FormData();
    if (values.mediaContent.uri !== '' || values.textContent !== '') {
      if (values.mediaContent?.uri) {
        const dataType = values.mediaContent.type.includes('video') ? 'video' : 'image';
        if (
          values.mediaContent?.uri &&
          values.mediaContent?.name !== '' &&
          values.mediaContent?.type !== ''
        ) {
          formData.append('mediaContent', values.mediaContent);
        }
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
      formData.append('shareWith', values.shareWith?.toLowerCase());
      onEditContent(formData);
    } else {
      showSnackbar({message: 'Please enter at least one image or text.'});
    }
  };

  const imagePath = newsFeed?.imageContentLink?.[0]?.high || '';
  const videoPath = newsFeed?.videoContentLink?.[0]?.VideoPath || '';

  const initialValues: MyFormValues = {
    textContent: processContentString(newsFeed.textContent),
    mediaContent: {
      uri: newsFeed.contentDataType === 'video' ? videoPath : imagePath,
      name: '',
      type: newsFeed.contentDataType,
    },
    shareWith: newsFeed.shareWith,
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeAreaView}>
      <View style={styles.container}>
        <Formik
          initialValues={initialValues}
          validateOnChange={false}
          validationSchema={schema}
          onSubmit={editFormData}>
          {formikProps => {
            const {setFieldValue, handleSubmit, values} = formikProps;
            const submitEnable =
              values.textContent.trim().length !== 0 || values.mediaContent.uri !== '';
            return (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'height' : undefined}
                flex={1}
                keyboardVerticalOffset={
                  Platform.OS === 'ios'
                    ? Dimensions.get('screen').height * 0.25
                    : Dimensions.get('screen').height * 0.125
                }>
                <ContentEditor
                  {...props}
                  {...{formikProps}}
                  title={route.params.title}
                  user={user}
                />
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
              </KeyboardAvoidingView>
            );
          }}
        </Formik>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  mainContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    padding: 5,
  },
  imageClose: {
    position: 'absolute',
    right: '6%',
    top: -5,
    width: 30,
    height: 30,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
  },
  vieoClose: {
    position: 'absolute',
    right: -10,
    top: -10,
    width: 30,
    height: 30,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    zIndex: 9999,
  },
  textContent: {
    flex: 1,
    fontSize: 14,
    marginTop: Platform.select({ios: 7, android: 0}),
  },
  textComponent: {
    flexDirection: 'row',
    padding: 10,
  },
  imageComponent: {
    padding: 15,
    height: 400,
    width: '80%',
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomComponent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    minHeight: 40,
  },
  mediaContentView: {
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

export default EditPost;
