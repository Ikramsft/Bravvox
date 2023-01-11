import {Button, CheckIcon, Spinner, Text, View} from 'native-base';
import React, {useMemo, useState, useRef} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FormikProps, useFormik} from 'formik';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as Yup from 'yup';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Config from 'react-native-config';
import FloatingInput from '../../../components/FloatingInput';
import {RootStackParamList} from '../../../navigation';
import {checkUsernameIsValid} from '../../../redux/reducers/user/UserServices';
import useUserInfo from '../../../hooks/useUserInfo';
import {theme} from '../../../theme';
import {useSettingOptions} from '../SettingOperations/useSettingOperations';
import HeaderLeft from '../../../components/HeaderLeft';
import HeaderTitle from '../../../components/HeaderTitle';
import {showSnackbar} from '../../../utils/SnackBar';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

interface MyFormValues {
  email: string;
  userName: string;
  name: string;
  confirmEmail: string;
  validUsername?: boolean;
}

const schema = Yup.object().shape({
  email: Yup.string().email('Email address must be a valid email format.'),
  // .required('Please enter valid email'),
  confirmEmail: Yup.string().oneOf(
    [Yup.ref('email'), null],
    'Confirm email should match with email',
  ),
  userName: Yup.string()
    .min(4, 'Username must be at least 4 characters long.')
    .max(72, 'Username should be 4 to 72 characters long.')
    .required('Please enter valid username'),
  name: Yup.string()
    .min(2, 'Display name must be at least 2 characters long.')
    .max(72, 'Display name should be 2 to 72 characters long.')
    .required('Please enter valid display name'),
});

function AccountDetails(props: Props) {
  const {navigation} = props;

  const {user, loading} = useUserInfo();
  const {name, userName: username, email: oldEmail} = user;

  const usernameRef = useRef<TextInput>(null);
  const displayName = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const cnfEmail = useRef<TextInput>(null);

  const {handleUpdateEmail, handleUpdateAccount} = useSettingOptions();

  const [validatingUsername, setValidatingUsername] = useState(false);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Account Details" />;

    const headerRight = () => (
      <TouchableOpacity activeOpacity={0.9} onPress={navigation.goBack}>
        <Text color={theme.colors.red[900]}>Cancel</Text>
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

  const initialValues = useMemo(() => {
    return {email: oldEmail, userName: username, name, confirmEmail: ''};
  }, [name, oldEmail, username]);

  const onSubmit = async (values: MyFormValues) => {
    if (name !== values.name || username !== values.userName) {
      handleUpdateAccount({name: values.name, username: values.userName});
    }
    if (values.email && oldEmail !== values.email) {
      handleUpdateEmail(values.email.toLowerCase());
    }
  };

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit,
  });

  const {
    values,
    errors,
    setFieldValue,
    validateField,
    setFieldError,
    handleChange,
    handleSubmit,
    touched,
    handleBlur,
  } = formik;

  const userURL = `https://${Config.DEEP_LINK_URL}/profile/${values.userName}`;
  const copyLink = () => {
    Clipboard.setString(userURL);
    showSnackbar({message: 'Link Copied', type: 'info'});
  };

  const validateEmail = (tempEmail: string) => {
    return String(tempEmail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const isValidData = useMemo(() => {
    return (
      (values.userName && values.userName !== username) ||
      (values.name && values.name !== name) ||
      (values.email &&
        validateEmail(values.email) &&
        values.confirmEmail &&
        validateEmail(values.confirmEmail))
    );
  }, [values, username, name]);

  const validateUserName = async () => {
    if (username !== values.userName) {
      setValidatingUsername(true);
      if (!values.userName) {
        setFieldError('userName', undefined);
        return;
      }
      validateField('userName');
      const isValid = await checkUsernameIsValid(values.userName);
      if (isValid) {
        setFieldValue('validUsername', true);
      } else {
        setFieldError('userName', 'Username already in use, please select another.');
      }
      setValidatingUsername(false);
    }
  };

  const focusUsername = () => usernameRef.current?.focus();
  const focusDisplay = () => displayName.current?.focus();
  const focusEmail = () => emailRef.current?.focus();
  const focusConfirmEmail = () => cnfEmail.current?.focus();

  return (
    <View backgroundColor={theme.colors.white} flex={1} pt={3} px={5}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View>
          <FloatingInput
            lowerCaseOnly
            autoComplete="username"
            containerStyles={styles.containerStyles}
            error={errors.userName}
            inputStyles={styles.inputStyles}
            label="User Name"
            labelStyles={styles.labelStyles}
            ref={usernameRef}
            returnKeyType="next"
            rightComponent={
              validatingUsername ? (
                values.userName !== '' ? (
                  <Spinner accessibilityLabel="Validating username" />
                ) : undefined
              ) : !errors.userName && values.validUsername ? (
                <CheckIcon color="green.500" mt={2} size="5" />
              ) : undefined
            }
            value={values.userName}
            viewStyle={styles.viewStyle}
            onBlur={validateUserName}
            onChangeText={handleChange('userName')}
            onSubmitEditing={focusDisplay}
          />
        </View>
        <View>
          <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
            <View flexDirection="row" pt={3}>
              <View style={styles.inviteTextView}>
                <Text color="black.500" fontSize={13}>
                  Your Bravvox URL:
                </Text>
                <Text>{userURL}</Text>
              </View>
              <TouchableOpacity style={styles.materialIcon} onPress={copyLink}>
                <MaterialIcons
                  suppressHighlighting
                  name="file-copy"
                  size={20}
                  style={styles.materialIcon}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>

        <View>
          <FloatingInput
            autoComplete="name"
            containerStyles={styles.containerStyles}
            error={errors.name}
            inputStyles={styles.inputStyles}
            label="Display Name"
            labelStyles={styles.labelStyles}
            ref={displayName}
            returnKeyType="next"
            value={values.name}
            viewStyle={styles.viewStyle}
            onChangeText={handleChange('name')}
            onSubmitEditing={focusEmail}
          />
        </View>
        <View>
          <FloatingInput
            lowerCaseOnly
            autoComplete="email"
            containerStyles={styles.containerStyles}
            error={touched.email ? errors.email : ''}
            inputStyles={styles.inputStyles}
            keyboardType="email-address"
            label="Email"
            labelStyles={styles.labelStyles}
            returnKeyType="next"
            value={values.email}
            viewStyle={styles.viewStyle}
            onBlur={handleBlur('email')}
            onChangeText={handleChange('email')}
            onSubmitEditing={focusConfirmEmail}
          />
        </View>
        <View>
          <FloatingInput
            lowerCaseOnly
            autoComplete="email"
            containerStyles={styles.containerStyles}
            error={touched.confirmEmail ? errors.confirmEmail : ''}
            inputStyles={styles.inputStyles}
            keyboardType="email-address"
            label="Confirm Email"
            labelStyles={styles.labelStyles}
            returnKeyType="next"
            value={values.confirmEmail}
            viewStyle={styles.viewStyle}
            onBlur={handleBlur('confirmEmail')}
            onChangeText={handleChange('confirmEmail')}
            onSubmitEditing={focusUsername}
          />
        </View>

        <View my={5}>
          <Button
            _text={{color: 'white'}}
            backgroundColor="#4496f3"
            isDisabled={!isValidData}
            isLoading={loading}
            isLoadingText="Updating"
            style={styles.buttonStyle}
            onPress={() => handleSubmit()}>
            Update
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewStyle: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderRadius: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    flex: 1,
    marginStart: 10,
  },
  inputStyles: {
    minHeight: 28,
    color: theme.colors.black[700],
    flex: 1,
    zIndex: 0,
    paddingHorizontal: 0,
  },
  labelStyles: {
    marginLeft: -5,
  },
  containerStyles: {
    paddingHorizontal: 0,
    paddingTop: 30,
  },
  buttonStyle: {
    borderRadius: 40,
    height: 45,
  },
  inviteTextView: {
    flex: 1,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderLeftWidth: 0.2,
    borderColor: theme.colors.gray[400],
    padding: 10,
  },
  materialIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: theme.colors.gray[100],
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 0.2,
    borderColor: theme.colors.gray[400],
  },
});

export default AccountDetails;
