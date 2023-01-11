import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChevronLeftIcon, Text, View} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Caption} from '../../../components/Typography';
import {RootStackParamList} from '../../../navigation';
import {resendCheckEmail} from '../../../redux/reducers/user/UserServices';
import {showSnackbar} from '../../../utils/SnackBar';
import AuthHeader from '../Components/AuthHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckEmail'>;

function CheckEmail(props: Props) {
  const {route, navigation} = props;
  const {email} = route?.params || {};

  const resendMail = async () => {
    if (email) {
      const res = await resendCheckEmail(email);
      showSnackbar({message: res.message, type: res.error ? 'danger' : 'info', duration: 7000});
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        <AuthHeader />
        <TouchableOpacity onPress={navigation.goBack}>
          <View alignItems="center" flexDirection="row" mt={10}>
            <ChevronLeftIcon ml={-3} size="20px" />
          </View>
        </TouchableOpacity>
        <Text fontFamily="heading" fontSize="2xl" fontWeight="400" mt={3}>
          Check your email!
        </Text>
        <Caption mt="5">We've sent an email to </Caption>
        <Text fontSize="sm" fontWeight="bold">
          {email}
        </Text>
        <Caption mt={3}>
          Click the link in email to confirm your email address and activate your account.
        </Caption>
        <Text fontSize="sm" fontWeight="bold" mt="12">
          Didn't get the email?
        </Text>
        <Caption mt={3}>
          Check your spam folder or{' '}
          <Text color="blue.500" onPress={resendMail}>
            resend the email
          </Text>
        </Caption>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 25,
  },
});

export default CheckEmail;
