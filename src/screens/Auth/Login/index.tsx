import React, {useMemo, useRef} from 'react';
import {Text, Button, View, Checkbox, Icon, useColorModeValue, useTheme} from 'native-base';
import {StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import * as Yup from 'yup';
import {FormikProps, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useDispatch} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthHeader from '../Components/AuthHeader';
import {RootStackParamList} from '../../../navigation';
import {
  userLogin,
  getUserProfile,
  getMessengerProfile,
} from '../../../redux/reducers/user/UserServices';
import useUserInfo from '../../../hooks/useUserInfo';
import RenderInput from '../../../components/RenderInput';

interface MyFormValues {
  Username: string;
  password: string;
  rememberMe: boolean;
}

const schema = Yup.object().shape({
  Username: Yup.string().required('Please enter valid email'),
  password: Yup.string().required('Please enter valid password'),
});

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

function Login(props: Props) {
  const {navigation} = props;
  const dispatch = useDispatch();

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['40'], colors.white);

  const passwordRef = useRef<TextInput>(null);

  const user = useUserInfo();
  const {documentId} = user;

  const lockIcon = (
    <SimpleLineIcons color={iconColor} name="lock" size={18} style={styles.iconStyle} />
  );
  const userIcon = (
    <SimpleLineIcons color={iconColor} name="user" size={18} style={styles.iconStyle} />
  );

  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [wrongDetails, setWrongDetails] = React.useState(false);

  const onSubmit = React.useCallback(
    async (values: MyFormValues) => {
      try {
        setLoading(true);
        const Username = values.Username?.toLowerCase();
        const newValues: MyFormValues = {...values, Username};
        await dispatch(userLogin(newValues));
      } catch (error) {
        setLoading(false);
        setWrongDetails(true);
        removeFocus();
      }
    },
    [dispatch],
  );

  const focusPassword = () => passwordRef.current?.focus();
  const removeFocus = () => passwordRef.current?.blur();

  const initialValues = {Username: '', password: '', rememberMe: false};

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues,
    validationSchema: schema,
    validateOnChange: false,
    onSubmit,
  });

  const {handleChange, handleSubmit, values, errors, setFieldValue, resetForm} = formik;

  React.useEffect(() => {
    let tm: NodeJS.Timeout | null = null;
    if (documentId) {
      try {
        dispatch(getUserProfile(documentId));
        dispatch(getMessengerProfile());
        tm = setTimeout(() => {
          setLoading(false);
          resetForm();
        }, 1500);
      } catch (error) {
        setLoading(false);
      }
    }

    return () => {
      if (tm) {
        clearTimeout(tm);
      }
    };
  }, [documentId, dispatch, resetForm]);

  const isValidData = useMemo(() => {
    return values.Username && values.password;
  }, [values]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AuthHeader />
          <Text fontFamily="heading" fontSize={24} fontWeight="500" mt={10}>
            Log in to Bravvox
          </Text>
          <Text fontFamily="heading" fontSize="md" fontWeight="400" mt={2}>
            A space to connect with friends and loved ones while discovering new ideas.
          </Text>
          <View width="100%">
            <View mb={5} mt={5}>
              <RenderInput
                autoComplete="email"
                caretHidden={false}
                error={errors.Username}
                InputLeftElement={userIcon}
                isInvalid={wrongDetails}
                keyboardType="email-address"
                labelStyles={styles.labelStyles}
                placeholder="Email/ Username*"
                returnKeyType="next"
                size="lg"
                value={values.Username}
                onChange={() => setWrongDetails(false)}
                onChangeText={handleChange('Username')}
                onSubmitEditing={focusPassword}
              />
            </View>
            <View mb={5}>
              <RenderInput
                error={errors.password}
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
                isInvalid={wrongDetails}
                labelStyles={styles.labelStyles}
                placeholder="Password*"
                ref={passwordRef}
                returnKeyType="next"
                size="lg"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={() => setWrongDetails(false)}
                onChangeText={handleChange('password')}
              />
            </View>
            <View mt={4} style={styles.forgotPassword}>
              <Checkbox
                isInvalid
                colorScheme="danger"
                isChecked={values.rememberMe}
                value="tncAccepted"
                onChange={() => setFieldValue('rememberMe', !values.rememberMe)}>
                <Text fontSize="sm" ml={2}>
                  Remember Me
                </Text>
              </Checkbox>
              <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text color={colors.primary[500]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View mt={4}>
              <Button
                _loading={{_text: {color: colors.white}}}
                backgroundColor={colors.black[1000]}
                isDisabled={!isValidData}
                isLoading={loading}
                isLoadingText="Logging In"
                mt="5"
                style={styles.buttonStyle}
                onPress={() => handleSubmit()}>
                Log In
              </Button>
            </View>
            <View mt={5} style={styles.footer}>
              <TouchableOpacity activeOpacity={1} style={styles.registerTextStyle}>
                <Text>Not part of the Bravvox family? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text color={colors.primary[500]}>Create Account</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default Login;

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  footer: {
    justifyContent: 'center',
    // alignItems: 'center',
  },
  forgotPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconStyle: {
    marginLeft: 10,
  },
  labelStyles: {
    marginLeft: -5,
  },
  buttonStyle: {
    height: 45,
  },
  registerTextStyle: {
    flexDirection: 'row',
  },
});
