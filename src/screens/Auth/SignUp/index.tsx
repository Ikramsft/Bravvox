import {
  Button,
  Checkbox,
  Divider,
  Icon,
  Text,
  useColorModeValue,
  useDisclose,
  useTheme,
  View,
} from 'native-base';
import React, {useMemo, useState, useRef, useEffect} from 'react';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Formik, FormikHelpers, FormikProps} from 'formik';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import * as Yup from 'yup';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useDispatch} from 'react-redux';
import {RenderError} from '../../../components/FloatingInput';
import AuthHeader from '../Components/AuthHeader';
import {RootStackParamList} from '../../../navigation';
import {userSignUp} from '../../../redux/reducers/user/UserServices';
import useUserInfo from '../../../hooks/useUserInfo';
import {theme} from '../../../theme';
import {PASS_REGEX} from '../../../constants/common';
import RenderInput from '../../../components/RenderInput';
import SafeTouchable from '../../../components/SafeTouchable';
import TermsCondition from './TermsConditionModal';

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

interface formProps extends Props {
  formikProps: FormikProps<MyFormValues>;
}

interface MyFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  aboveThirteen: boolean;
  tncAccepted: boolean;
  validUsername?: boolean;
}

const schema = Yup.object().shape({
  email: Yup.string().email('Enter a valid email address.').required('Please enter valid email'),
  password: Yup.string()
    .max(72, 'Display name should be 8 to 128 characters long.')
    .matches(
      PASS_REGEX,
      'Password must be between 8-40 characters, it must contain 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.'),
  aboveThirteen: Yup.mixed().test(
    'test',
    'Please confirm that you are 13+ years old.',
    value => value,
  ),
  tncAccepted: Yup.mixed().test(
    'test',
    'Please confirm that you agree with the Terms & Conditions.',
    value => value,
  ),
});

function RenderForm(props: formProps) {
  const {navigation, formikProps} = props;

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['40'], colors.white);

  const {loading} = useUserInfo();
  const {isOpen, onOpen, onClose} = useDisclose();

  const {values, errors, setFieldValue, handleChange, handleSubmit, handleBlur, touched} =
    formikProps;
  const [active, setActive] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const passwordRef = useRef<TextInput>(null);
  const cnfPasswordRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);

  const lockIcon = (
    <SimpleLineIcons color={iconColor} name="lock" size={18} style={styles.iconStyle} />
  );

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    errors.email && active && focusEmail();
  }, [active, errors.email]);

  const isValidData = useMemo(() => {
    return (
      values.email &&
      values.password &&
      !errors.password &&
      values.confirmPassword &&
      !errors.confirmPassword &&
      values.aboveThirteen &&
      values.tncAccepted
    );
  }, [values, errors]);

  const focusPassword = () => passwordRef.current?.focus();
  const focusConfirmPassword = () => cnfPasswordRef.current?.focus();
  const focusEmail = () => emailRef.current?.focus();
  const navigateLogIn = () => navigation.navigate('Login');
  const toggleTerms = () => setFieldValue('tncAccepted', !values.tncAccepted);

  return (
    <>
      <View mt={5}>
        <RenderInput
          autoComplete="email"
          caretHidden={false}
          error={values.email !== '' ? errors.email : ''}
          InputLeftElement={
            <Fontisto color={iconColor} name="email" size={18} style={styles.iconStyle} />
          }
          keyboardType="email-address"
          labelStyles={styles.labelStyles}
          placeholder="Email Address*"
          ref={emailRef}
          returnKeyType="next"
          size="lg"
          value={values.email}
          onBlur={handleBlur('email')}
          onChangeText={handleChange('email')}
          onSubmitEditing={focusPassword}
        />
      </View>
      <View mt={5}>
        <RenderInput
          error={touched.password && values.password !== '' ? errors.password : ''}
          InputLeftElement={lockIcon}
          InputRightElement={
            <Icon
              as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />}
              color="muted.400"
              mr="3"
              size={6}
              onPress={() => setShowPassword(v => !v)}
            />
          }
          labelStyles={styles.labelStyles}
          placeholder="Password *"
          ref={passwordRef}
          returnKeyType="next"
          size="lg"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          onBlur={handleBlur('password')}
          onChangeText={handleChange('password')}
          onSubmitEditing={focusConfirmPassword}
        />
      </View>
      <View mt={5}>
        <RenderInput
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          InputLeftElement={lockIcon}
          InputRightElement={
            <Icon
              as={<MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} />}
              color="muted.400"
              mr="3"
              size={6}
              onPress={() => setShowConfirmPassword(v => !v)}
            />
          }
          labelStyles={styles.labelStyles}
          placeholder="Confirm Password *"
          ref={cnfPasswordRef}
          returnKeyType="done"
          size="lg"
          type={showConfirmPassword ? 'text' : 'password'}
          value={values.confirmPassword}
          onBlur={handleBlur('confirmPassword')}
          onChangeText={handleChange('confirmPassword')}
        />
      </View>
      <View mt={2} pt={5}>
        <Checkbox
          isInvalid
          colorScheme="danger"
          isChecked={values.aboveThirteen}
          value="aboveThirteen"
          onChange={() => setFieldValue('aboveThirteen', !values.aboveThirteen)}>
          <Text fontSize="sm" ml={2}>
            I'm 13 years old or older
          </Text>
        </Checkbox>
        <RenderError error={touched.aboveThirteen ? errors.aboveThirteen : ''} mt={1} />
      </View>
      <View alignItems="center" flexDirection="row" my={5}>
        <Checkbox
          isInvalid
          accessibilityLabel="Terms"
          colorScheme="danger"
          isChecked={values.tncAccepted}
          value="tncAccepted"
          onChange={toggleTerms}
        />
        <View flexDirection="row">
          <Text fontSize="sm" ml={4}>
            I agree to
          </Text>
          <SafeTouchable onPress={onOpen}>
            <Text color={theme.colors.primary[500]} ml="1">
              Terms and Conditions
            </Text>
          </SafeTouchable>
        </View>
        <RenderError error={touched.tncAccepted ? errors.tncAccepted : ''} mt={1} />
      </View>
      <View my={5}>
        <Button
          _loading={{_text: {color: colors.white}}}
          backgroundColor={theme.colors.black[1000]}
          isDisabled={!isValidData}
          isLoading={loading}
          isLoadingText="Registering"
          style={styles.buttonStyle}
          onPress={() => {
            handleSubmit();
            setActive(true);
          }}>
          Create Account
        </Button>
      </View>
      <Divider my={3} />
      <View style={styles.footer}>
        <TouchableOpacity activeOpacity={1} style={styles.loginTextStyle}>
          <Text>Already part of the Bravvox family?</Text>
          <TouchableOpacity onPress={navigateLogIn}>
            <Text color={theme.colors.primary[500]}> Log in</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
      <TermsCondition isOpen={isOpen} toggle={onClose} />
    </>
  );
}

function SignUp(props: Props) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const onSubmit = async (values: MyFormValues, helpers: FormikHelpers<MyFormValues>) => {
    delete values?.validUsername;

    const newValues: MyFormValues = {
      ...values,
      email: values.email.toLowerCase(),
      // username: values.username.toLowerCase(),
    };

    await dispatch(userSignUp(newValues));
    helpers.resetForm();
    navigation.navigate('CheckEmail', {email: values.email.toLowerCase()});
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView bounces={false} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AuthHeader />
          <Text fontFamily="heading" fontSize="2xl" fontWeight="400" mt={10}>
            Account Details
          </Text>
          <Formik
            initialValues={{
              email: '',
              username: '',
              name: '',
              password: '',
              confirmPassword: '',
              tncAccepted: false,
              aboveThirteen: false,
            }}
            validateOnChange={false}
            validationSchema={schema}
            onSubmit={onSubmit}>
            {formikProps => <RenderForm {...props} {...{formikProps}} />}
          </Formik>
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
  },
  footer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  // eslint-disable-next-line react-native/no-color-literals

  iconStyle: {
    marginLeft: 10,
  },
  labelStyles: {
    marginLeft: -5,
  },
  buttonStyle: {
    height: 45,
  },
  loginTextStyle: {
    flexDirection: 'row',
  },
});

export default SignUp;
