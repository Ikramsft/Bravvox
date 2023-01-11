import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FormikProps, useFormik} from 'formik';
import {Button, CheckIcon, Spinner, Text, useTheme, View} from 'native-base';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput} from 'react-native';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import * as Yup from 'yup';
import RenderInput from '../../../components/RenderInput';
import useUserInfo from '../../../hooks/useUserInfo';
import {RootStackParamList} from '../../../navigation';
import {IUserData} from '../../../redux/reducers/user/UserInterface';
import {theme} from '../../../theme';
import {showSnackbar} from '../../../utils/SnackBar';
import AuthHeader from '../../Auth/Components/AuthHeader';
import {
  AvatarCoverImage,
  AVATAR_IMAGE_SIZE,
  ISelectFile,
} from '../../../components/AvatarCoverImage';
import {
  checkUsernameIsValid,
  getMessengerProfile,
  getUserProfile,
  updateProfilePic,
  updateUsernameFirstScreen,
  uploadProfile,
} from '../../../redux/reducers/user/UserServices';
import {ImageUpdateType} from '../../Profile/useUpdateAvatar';
import StepHeader from '../StepHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckEmail'>;

interface MyFormValues {
  name: string;
  username: string;
  profilePic: string;
  validUsername?: boolean;
}

const userNameValidationErrorMsg =
  'Username must be between 4-72 characters and contain no spaces. May include only an underscore _ or hyphen - as special characters.';

const schema = Yup.object().shape({
  username: Yup.string()
    .required('Please enter valid username')
    .matches(/^[a-zA-Z0-9_-]+$/, userNameValidationErrorMsg)
    .max(72, userNameValidationErrorMsg)
    .min(4, userNameValidationErrorMsg),
  name: Yup.string().required('Please enter valid First and Last Name'),
});

function GetStartedStepOne(props: Props) {
  const {navigation} = props;

  const dispatch = useDispatch();
  const usernameRef = useRef<TextInput>(null);
  const isFocused = useIsFocused();

  const {colors} = useTheme();

  const [isLoadingAvatar, setIsLoadingAvatar] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const {user} = useUserInfo();
  const [validatingUsername, setValidatingUsername] = useState(false);
  const {userName, name, documentId} = user;
  const {coverPic, profilePic} = user as IUserData;

  const [profilePhoto, setProfilePic] = useState<string>();

  const initialValues = {username: userName, name, profilePic: ''};

  const onSubmit = React.useCallback(
    async (values: MyFormValues) => {
      try {
        setLoading(true);
        const username = values.username?.toLowerCase();
        const newValues: MyFormValues = {...values, username};
        await dispatch(updateUsernameFirstScreen(newValues));
        dispatch(getUserProfile(documentId));
        dispatch(getMessengerProfile());
        navigation.navigate('GetStartedStepTwo');
        setLoading(false);

        // eslint-disable-next-line no-empty
      } catch (error) {
        setLoading(false);
      }
    },
    [dispatch, documentId, navigation],
  );

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues,
    validationSchema: schema,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit,
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldError,
    validateField,
    handleBlur,
    setFieldValue,
  } = formik;

  useEffect(() => {
    if (isFocused) {
      setFieldError('username', undefined);
    }
  }, [isFocused, setFieldError]);

  useEffect(() => {
    AndroidKeyboardAdjust?.setAdjustResize();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      validateUserName();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.username]);

  const validateUserName = async () => {
    if (userName !== values.username) {
      setValidatingUsername(true);
      if (!values.username) {
        setFieldError('username', undefined);
        return;
      }
      validateField('username');
      const isValid = await checkUsernameIsValid(values.username);
      if (isValid) {
        setFieldValue('validUsername', true);
      } else {
        setFieldError('username', 'Username already in use, please select another.');
      }
    }
    setValidatingUsername(false);
  };

  const focusUsername = () => usernameRef.current?.focus();

  const selectFile = (payload: ISelectFile, type: ImageUpdateType) => {
    if (type === 'avatar') {
      setProfilePic(payload.croppedFile);
      updateProfilePhoto(payload);
    }
  };

  const updateProfilePhoto = async (payload: ISelectFile) => {
    setIsLoadingAvatar(true);
    try {
      const response = await uploadProfile(payload);
      setProfilePic(payload.croppedFile);
      if (response.status === 200) {
        showSnackbar({message: response.message, type: 'success'});
        dispatch(updateProfilePic(response.data.profileCroppedPic));
      }
      setIsLoadingAvatar(false);
    } catch (e) {
      setIsLoadingAvatar(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AuthHeader />
          <StepHeader showBack={false} step="1" totalStep="5" />
          <Text fontFamily="heading" fontSize={24} fontWeight="500" lineHeight="md">
            Let's get started setting up your profile.
          </Text>
          <Text fontSize={17} fontWeight="500" mb="5" mt="5">
            Edit your profile photo.
          </Text>
          <View style={styles.changeImageContainer}>
            <AvatarCoverImage
              avatarContainerStyle={styles.avatarContainerStyle}
              containerStyle={styles.avatarCoverContainer}
              isCoverShow={false}
              isLoadingAvatar={isLoadingAvatar}
              selectFile={selectFile}
              uriAvatar={profilePhoto || profilePic}
              uriCover={coverPic}
            />
          </View>
          <Text fontSize={17} fontWeight="500">
            Complete your details.
          </Text>
          <View mt={3}>
            <RenderInput
              error={errors.name}
              labelStyles={styles.labelStyles}
              placeholder="First and Last Name"
              returnKeyType="next"
              size="lg"
              style={styles.inputStyles}
              value={values.name}
              onBlur={handleBlur('name')}
              onChangeText={handleChange('name')}
              onSubmitEditing={focusUsername}
            />
          </View>
          <View mt="5">
            <RenderInput
              error={errors.username}
              InputRightElement={
                <View mr="3">
                  {validatingUsername ? (
                    values.username !== '' && values.username !== userName ? (
                      <Spinner accessibilityLabel="Validating username" />
                    ) : undefined
                  ) : !errors.username && values.validUsername ? (
                    <CheckIcon color="green.500" mt={2} size="5" />
                  ) : undefined}
                </View>
              }
              labelStyles={styles.labelStyles}
              placeholder="Username"
              ref={usernameRef}
              returnKeyType="next"
              size="lg"
              style={styles.inputStyles}
              value={values.username}
              onBlur={validateUserName}
              onChangeText={handleChange('username')}
              onSubmitEditing={focusUsername}
            />
          </View>
          <Text color={colors.black[500]} fontSize={14} fontWeight="500" mb="5" mt="5">
            *All fields required
          </Text>
          <View alignItems="center" mt={5}>
            <Button
              _loading={{_text: {color: colors.white}}}
              backgroundColor={theme.colors.black[1000]}
              isLoading={loading}
              mt="5"
              style={styles.buttonStyle}
              width="100%"
              onPress={() => handleSubmit()}>
              Next
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  changeImageContainer: {
    alignItems: 'center',
    width: 120,
  },
  inputStyles: {
    paddingVertical: 10,
  },
  labelStyles: {
    marginLeft: -5,
  },
  buttonStyle: {
    height: 45,
  },
  avatarCoverContainer: {
    marginBottom: 25,
  },
  avatarContainerStyle: {
    width: AVATAR_IMAGE_SIZE,
    height: AVATAR_IMAGE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GetStartedStepOne;
