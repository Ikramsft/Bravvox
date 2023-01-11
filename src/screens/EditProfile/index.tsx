import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {View, Text} from 'native-base';
import * as Yup from 'yup';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import {Formik} from 'formik';
import {useQueryClient} from 'react-query';
import {RootStackParamList} from '../../navigation';
import {showSnackbar} from '../../utils/SnackBar';
import {theme} from '../../theme';
import useUserInfo from '../../hooks/useUserInfo';
import {
  updateAccount,
  updateCoverPic,
  updateProfilePic,
  uploadCoverPhoto,
  uploadProfile,
} from '../../redux/reducers/user/UserServices';
import {IUserData} from '../../redux/reducers/user/UserInterface';
import {userUpdate} from '../../redux/reducers/user/UserActions';
import {ImageUpdateType} from '../Profile/useUpdateAvatar';
import {AvatarCoverImage, ISelectFile} from '../../components/AvatarCoverImage';
import {EditProfileForm} from './EditProfileForm';
import {QueryKeys} from '../../utils/QueryKeys';
import {URL_REGEX} from '../../constants/common';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {IFeedPages} from '../Home/useNewsFeed';

const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required('Please Enter Display Name')
    .min(2, 'Please Enter More Than Two Character'),
  website: Yup.string().matches(URL_REGEX, 'Website must be a valid URL').optional().nullable(),
});

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

interface WithReduxProps extends Props {
  isLoading: boolean | undefined;
}

interface MyFormValues {
  name: string;
  profileTagline: string;
  bio: string;
  website: string;
  location: string;
  facebookAccount: string;
  twitterAccount: string;
}

function EditProfile(props: WithReduxProps) {
  const {navigation} = props;
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const {user} = useUserInfo();
  const {
    documentId,
    profileTagline,
    name: displayName,
    bio: userBio,
    website: userWebsite,
    location: userLocation,
    facebookAccount,
    twitterAccount,
    profileCroppedPic,
    profilePic,
    coverPic,
    profilePicCroppedDetails,
    coverPicCroppedDetails,
    coverCroppedPic,
  } = user as IUserData;

  const [isLoadingCover, setIsLoadingCover] = useState<boolean>(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const [onSubmitting, setOnSubmitting] = useState<boolean>(false);

  const [profilePhoto, setProfilePic] = useState<string>(profileCroppedPic || profilePic);
  const [bannerImage, setBannerImage] = useState<string>(coverCroppedPic || coverPic);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;

    const headerTitle = () => <HeaderTitle title="Edit Profile" />;

    const headerRight = () => (
      <TouchableOpacity activeOpacity={0.9} onPress={navigation.goBack}>
        <Text color={theme.colors.red[900]} style={styles.cancelTextStyle}>
          Cancel
        </Text>
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateHomeProfilePicToCache = async () => {
    const cacheKey = [QueryKeys.userFeed, user.documentId];
    const feed = await queryClient.getQueryData<IFeedPages>(cacheKey);
    if (feed) {
      const {pages} = feed;
      const updatedPages = pages.map(c => {
        const {data: posts, ...rest} = c;
        const updatedPosts = posts.map(post => {
          if (post.userId === user.documentId) {
            const {userInfo} = post;
            userInfo.profilePic = profilePhoto;
            return {
              ...post,
              userInfo,
            };
          }
          return post;
        });
        return {...rest, data: updatedPosts};
      });
      const updateFeed = {...feed, pages: updatedPages};
      queryClient.setQueryData<IFeedPages>(cacheKey, {...updateFeed});
    }
  };
  const onSubmit = async (values: MyFormValues) => {
    setOnSubmitting(true);
    try {
      const newValues: MyFormValues = {
        ...values,
      };

      const response = await updateAccount(newValues);
      setOnSubmitting(false);
      if (response.status === 200 && documentId) {
        dispatch(userUpdate(newValues));
        const detailCacheKey = [QueryKeys.userProfileDetails];
        queryClient.invalidateQueries(detailCacheKey);
        showSnackbar({message: response.message, type: 'success'});
        navigation.navigate('Profile', {userName: user.userName, userId: user.documentId});
      }
    } catch (error: any) {
      showSnackbar({message: error.message, type: 'danger'});
      setOnSubmitting(false);
    }
  };

  const updateProfilePhoto = async (payload: ISelectFile) => {
    setIsLoadingAvatar(true);
    try {
      const {status, data, message} = await uploadProfile(payload);
      setProfilePic(payload.croppedFile);
      if (status === 200) {
        showSnackbar({message, type: 'success'});
        dispatch(
          updateProfilePic({
            profileCroppedPic: data.profileCroppedPic,
            profilePic: data.profilePic,
            profilePicCroppedDetails: data.profilePicCroppedDetails,
          }),
        );
        const detailCacheKey = [QueryKeys.userProfileDetails];
        queryClient.invalidateQueries(detailCacheKey);
        queryClient.invalidateQueries(QueryKeys.homeFeed);
        updateHomeProfilePicToCache();
      }
      setIsLoadingAvatar(false);
    } catch (e) {
      setIsLoadingAvatar(false);
    }
  };

  const updateCoverPhoto = async (payload: ISelectFile) => {
    setIsLoadingCover(true);
    try {
      const {status, data, message} = await uploadCoverPhoto(payload);
      setBannerImage(payload.croppedFile);
      if (status === 200) {
        showSnackbar({message, type: 'success'});
        updateCoverPic({
          coverCroppedPic: data.coverCroppedPic,
          coverPic: data.coverPic,
          coverPicCroppedDetails: data.coverPicCroppedDetails,
        });
        const detailCacheKey = [QueryKeys.userProfileDetails];
        queryClient.invalidateQueries(detailCacheKey);
      }
      setIsLoadingCover(false);
    } catch (e) {
      setIsLoadingCover(false);
    }
  };

  const selectFile = (payload: ISelectFile, type: ImageUpdateType) => {
    if (type === 'cover') {
      setBannerImage(payload.croppedFile);
      updateCoverPhoto(payload);
    }
    if (type === 'avatar') {
      setProfilePic(payload.croppedFile);
      updateProfilePhoto(payload);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView extraHeight={350} keyboardShouldPersistTaps="handled">
        <AvatarCoverImage
          avatarViewAttribute={profilePicCroppedDetails}
          coverViewAttribute={coverPicCroppedDetails}
          isLoadingAvatar={isLoadingAvatar}
          isLoadingCover={isLoadingCover}
          originalAvatar={profilePic}
          originalCover={coverPic}
          selectFile={selectFile}
          uriAvatar={profilePhoto || profileCroppedPic}
          uriCover={bannerImage || coverCroppedPic}
        />
        <View style={styles.formView}>
          <Formik
            initialValues={{
              name: displayName,
              profileTagline,
              bio: userBio,
              website: userWebsite,
              location: userLocation,
              facebookAccount,
              twitterAccount,
            }}
            validationSchema={schema}
            onSubmit={onSubmit}>
            {formikProps => (
              <EditProfileForm {...props} {...{formikProps}} isFormSubmitting={onSubmitting} />
            )}
          </Formik>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  formView: {
    padding: 25,
  },
  cancelTextStyle: {
    marginEnd: 6,
  },
});

export default EditProfile;
