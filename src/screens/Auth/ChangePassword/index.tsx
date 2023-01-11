import React, {useMemo, useRef} from 'react';
import {Text, Button, View, Icon, Divider} from 'native-base';
import {StyleSheet, TextInput} from 'react-native';
import * as Yup from 'yup';
import {FormikProps, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AuthHeader from '../Components/AuthHeader';
import {RootStackParamList} from '../../../navigation';
import {theme} from '../../../theme';
import {isAndroid, PASS_REGEX} from '../../../constants/common';
import RenderInput from '../../../components/RenderInput';
import {IChangePasswordType, useChangePassword} from './useChangePassword';
import {Caption} from '../../../components/Typography';

interface MyFormValues {
  password: string;
  confirmPassword: string;
  email: string;
  token: string;
}

const schema = Yup.object().shape({
  password: Yup.string()
    .required('Please enter valid password')
    .max(72, 'Display name should be 8 to 128 characters long.')
    .matches(
      PASS_REGEX,
      'Password must be between 8-40 characters, it must contain 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character.',
    ),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match.'),
});

type Props = NativeStackScreenProps<RootStackParamList, 'ChangePassword'>;

function ChangePassword(props: Props) {
  const {navigation, route} = props;
  const {params} = route;
  const {tokenId} = params;

  const confirmPasswordRef = useRef<TextInput>(null);

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {tryChangePassword, isLoading} = useChangePassword();

  const onSubmit = async (values: IChangePasswordType) => tryChangePassword(values);

  // eslint-disable-next-line no-unused-expressions
  isAndroid ? AndroidKeyboardAdjust.setAdjustResize() : null;

  const focusConfirmPassword = () => confirmPasswordRef.current?.focus();

  const initialValues = {password: '', confirmPassword: '', email: 'dummy', token: tokenId};

  const formik: FormikProps<MyFormValues> = useFormik<MyFormValues>({
    initialValues,
    validationSchema: schema,
    validateOnChange: true,
    onSubmit,
  });

  const {handleChange, handleSubmit, values, touched, errors, handleBlur} = formik;

  const isValidData = useMemo(() => {
    return values.password && values.confirmPassword && values.password === values.confirmPassword;
  }, [values]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <View>
            <AuthHeader />
          </View>
          <Text fontFamily="heading" fontSize="3xl" fontWeight="400" mt={10}>
            Update Password
          </Text>
          <Text fontFamily="heading" fontSize="md" fontWeight="400" mt={2}>
            Please enter a new password.
          </Text>
          <View width="100%">
            <View mb={5} mt={5}>
              <RenderInput
                error={touched.password ? errors.password : ''}
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
                maxLength={40}
                placeholder="Password"
                returnKeyType="next"
                size="lg"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                onSubmitEditing={focusConfirmPassword}
              />
            </View>
            <View mb={5}>
              <RenderInput
                error={touched.confirmPassword ? errors.confirmPassword : ''}
                InputRightElement={
                  <Icon
                    as={
                      <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} />
                    }
                    color="muted.400"
                    mr="3"
                    size={6}
                    onPress={() => setShowConfirmPassword(v => !v)}
                  />
                }
                labelStyles={styles.labelStyles}
                maxLength={40}
                placeholder="Confirm Password"
                ref={confirmPasswordRef}
                returnKeyType="next"
                size="lg"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onBlur={handleBlur('confirmPassword')}
                onChangeText={handleChange('confirmPassword')}
              />
            </View>
            <View mt={4}>
              <Button
                backgroundColor={theme.colors.black[1000]}
                isDisabled={!isValidData}
                isLoading={isLoading}
                isLoadingText="Update Password"
                mt="5"
                style={styles.buttonStyle}
                onPress={() => handleSubmit()}>
                Update Password
              </Button>
              <Divider my={3} />
              <View justifyContent="center">
                <Caption color={theme.colors.black[500]}>
                  Return to{' '}
                  <Text color={theme.colors.blue[500]} onPress={() => navigation.navigate('Login')}>
                    Login
                  </Text>
                </Caption>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

export default ChangePassword;

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
    backgroundColor: theme.colors.white,
  },
  container: {
    flexGrow: 1,
    padding: 25,
    marginTop: 40,
  },
  labelStyles: {
    marginLeft: -5,
  },
  buttonStyle: {
    height: 45,
  },
});
