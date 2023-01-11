import {Text, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {useConfirmModal} from '../../../components/CofirmationModel';
import {Caption, Title} from '../../../components/Typography';
import {resendCheckEmail} from '../../../redux/reducers/user/UserServices';
import {useUserLogout} from '../../../redux/reducers/user/useUserLogout';
import {showSnackbar} from '../../../utils/SnackBar';
import {IAccountReq, useSettingQueries} from '../Queries/useUserInfo';

const useSettingOptions = () => {
  const confirm = useConfirmModal();
  const {handleEditEmail, handleEditAccount} = useSettingQueries();
  const {logoutUser} = useUserLogout();
  const handleUpdateEmail = (email: string) => {
    confirm?.show?.({
      title: <Title fontSize={18}>Change Email</Title>,
      message: (
        <Text>
          <Text>
            Are you sure you want to change your email to
            <Text fontWeight="bold"> {email} </Text> ? If you choose to enter new email and click
            "update", you will be logged out of BravVox and will need to validate the email you
            receive at the email address in order to log back in. Note : If you do not set the email
            confirmation, be sure to check your spam folder.
          </Text>
        </Text>
      ),
      onConfirm: async () => {
        const response = await handleEditEmail({email});
        if (response.status === 200) {
            afterUpdatePopup(email);
        } else {
          showSnackbar({message: response.message, type: 'danger'});
        }
      },
      submitLabel: 'Yes/Change',
      cancelLabel: 'No/Return',
    });
  };

  const afterUpdatePopup = (email: string) => {
    confirm?.show?.({
      title: <Text fontWeight="bold"> Your email has been changed! </Text>,
      message: (
        <Text>
          <Text>
            An email has been sent to <Text fontWeight="bold"> {email} </Text> You will now be
            logged out. Please validate your new email address, log back into Bravvox, and continue
            sharing your brave voice with the world. Thank you.
          </Text>
        </Text>
      ),
      onConfirm: () => {
        logoutUser();
        sendMail(email);
      },
      submitLabel: 'Close',
      cancelLabel: undefined,
    });
  };

  const sendMail = (email: string) => {
    confirm?.show?.({
      title: <Title fontWeight="bold">Check your email</Title>,
      message: (
        <View style={styles.container}>
          <Caption mt="5">We've sent an email to </Caption>
          <Text fontSize="sm" fontWeight="bold">
            {email}
          </Text>
          <Caption mt={3}>
            Click the link in the email to confirm your address and activate your account.
          </Caption>
          <Text fontSize="sm" fontWeight="bold" mt="4">
            Didn't get the email?
          </Text>
          <Caption mt={3}>
            Check your spam folder or{' '}
            <Text color="blue.500" onPress={()=>resendMail(email)}>
              resend the email
            </Text>
          </Caption>
        </View>
      ),
      onConfirm: () => {
        logoutUser();
      },
      submitLabel: 'Close',
      cancelLabel: undefined,
    });
    
  };

  const resendMail = async (email:string) => {
    if (email) {
      const res = await resendCheckEmail(email);
      showSnackbar({message: res.message, type: res.error ? 'danger' : 'info', duration: 7000});
    }
  };

  const handleUpdateAccount = (data: IAccountReq) => {
    handleEditAccount(data);
  };

  return {
    handleUpdateEmail,
    handleUpdateAccount,
  };
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export {useSettingOptions};
