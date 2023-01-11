import React from 'react';
import {Text, Button, Divider, View, useTheme, useColorModeValue} from 'native-base';
import {StyleSheet} from 'react-native';
import * as Yup from 'yup';
import {Formik, FormikHelpers} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {connect, useDispatch} from 'react-redux';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import AuthHeader from '../Components/AuthHeader';
import {Caption} from '../../../components/Typography';
import {RootStackParamList} from '../../../navigation';
import {forgotPassword} from '../../../redux/reducers/user/UserServices';
import {showSnackbar} from '../../../utils/SnackBar';
import RenderInput from '../../../components/RenderInput';

const schema = Yup.object().shape({
  username: Yup.string().email('Enter valid Email Address').required('Please enter Email Address'),
});

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

interface WithReduxProps extends Props {
  isLoading: boolean | undefined;
}

interface ReduxState {
  user: {loading: boolean};
}

interface MyFormValues {
  username: string;
}

function ForgotPassword(props: WithReduxProps) {
  const {navigation, isLoading} = props;
  const dispatch = useDispatch();

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['40'], colors.white);
  const titleColor = useColorModeValue(colors.black[900], colors.white);
  const subTitleColor = useColorModeValue(colors.black[500], colors.white);

  const [onSuccess, setOnSuccess] = React.useState(false);

  const onSubmit = async (values: MyFormValues, helpers: FormikHelpers<MyFormValues>) => {
    try {
      const newValues: MyFormValues = {
        ...values,
        username: values.username.toLowerCase(),
      };
      await dispatch(forgotPassword(newValues));
      helpers.resetForm();
      setOnSuccess(true);
    } catch (error: any) {
      showSnackbar({message: error.message, type: 'danger'});
      setOnSuccess(false);
    }
  };

  const userIcon = (
    <SimpleLineIcons color={iconColor} name="user" size={18} style={styles.iconStyle} />
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <AuthHeader />
          <Text color={titleColor} fontFamily="heading" fontSize="2xl" fontWeight="400" mt={10}>
            Password Assistance
          </Text>

          <View>
            {onSuccess ? (
              <Caption color={subTitleColor} mt={5}>
                Thank you. Please check your email for instructions on how to reset your account.
              </Caption>
            ) : (
              <Caption color={subTitleColor} mt={5}>
                Please enter the email address associated with your Bravvox account.
              </Caption>
            )}
          </View>
          {!onSuccess && (
            <>
              <Formik
                initialValues={{username: ''}}
                validateOnChange={false}
                validationSchema={schema}
                onSubmit={onSubmit}>
                {({handleChange, handleSubmit, handleBlur, touched, values, errors}) => {
                  const submit = () => handleSubmit();
                  return (
                    <View width="100%">
                      <View mb={5} mt={5}>
                        <RenderInput
                          autoComplete="email"
                          error={touched.username ? errors.username : ''}
                          InputLeftElement={userIcon}
                          keyboardType="email-address"
                          labelStyles={styles.labelStyles}
                          placeholder="Email Address*"
                          returnKeyType="done"
                          size="lg"
                          value={values.username}
                          onBlur={handleBlur('username')}
                          onChangeText={handleChange('username')}
                          onSubmitEditing={submit}
                        />
                      </View>
                      <View>
                        <Button
                          isDisabled={
                            isLoading || !values.username || values.username.trim() === ''
                          }
                          isLoading={isLoading}
                          mt="5"
                          style={styles.buttonStyle}
                          onPress={submit}>
                          Reset Password
                        </Button>
                      </View>
                    </View>
                  );
                }}
              </Formik>
              <Divider my={3} />
            </>
          )}
          <View style={styles.footer}>
            <Caption color={colors.black[500]}>
              Return to{' '}
              <Text color={colors.blue[500]} onPress={navigation.goBack}>
                Login
              </Text>
            </Caption>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 25,
  },
  footer: {
    justifyContent: 'center',
    marginVertical: 20,
  },
  labelStyles: {
    marginLeft: -5,
  },
  buttonStyle: {
    borderRadius: 40,
    height: 45,
  },
  iconStyle: {
    marginLeft: 10,
  },
});

ForgotPassword.propTypes = {};

ForgotPassword.defaultProps = {};

const mapStateToProps = (state: ReduxState) => ({
  isLoading: state.user.loading,
});

export default connect(mapStateToProps)(ForgotPassword);
