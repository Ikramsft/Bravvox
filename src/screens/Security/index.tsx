/**
 * @format
 */
import React, {useRef, useState} from 'react';
import {View, Button} from 'native-base';
import {TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {RootNavigationType} from '../Home';
import MaterialInput from '../../components/MaterialInput';
import {theme} from '../../theme';
import {IPasswordType, useUpdatePasswordForm} from './useUpdatePasswordForm';
import {useUpdatePassword} from './useUpdatePassword';
import {Title} from '../../components/Typography';
import {PrivacyItem} from '../Groups/AddGroup/PrivacyItem';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';

function Security() {
  const navigation = useNavigation<RootNavigationType>();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Security" />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const {tryUpdatePassword, isLoading} = useUpdatePassword();

  const onSubmit = async (values: IPasswordType) => tryUpdatePassword(values);

  const onUpdatePress = () => handleSubmit();
  const formik = useUpdatePasswordForm(onSubmit);
  const {values, errors, handleChange, handleBlur, handleSubmit, touched} = formik;

  const newPasswordRef = useRef<TextInput>(null);
  const focusNewPassword = () => newPasswordRef.current?.focus();

  const confirmPasswordRef = useRef<TextInput>(null);
  const focusConfirmPassword = () => confirmPasswordRef.current?.focus();
  const [toggleValue, setToggleValue] = useState(false);

  const toggleTwoStepVerification = () => {
    return toggleValue === true ? setToggleValue(false) : setToggleValue(true);
  };

  const isFormValid = [
    touched.oldpassword && !errors.oldpassword,
    touched.newpassword && !errors.newpassword,
    touched.confirmpassword && !errors.confirmpassword,
  ].every(Boolean);

  return (
    <View backgroundColor={theme.colors.white} flex={1} pt={3} px={5}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Title fontFamily="heading" fontSize="md" mt={6}>
          Change Password
        </Title>
        <MaterialInput
          isPassword
          error={touched.oldpassword ? errors.oldpassword : ''}
          label="Old Password"
          maxLength={40}
          returnKeyType="next"
          value={values.oldpassword}
          onBlur={handleBlur('oldpassword')}
          onChangeText={handleChange('oldpassword')}
          onSubmitEditing={focusNewPassword}
        />
        <MaterialInput
          isPassword
          error={touched.newpassword ? errors.newpassword : ''}
          label="New Password"
          maxLength={40}
          ref={newPasswordRef}
          returnKeyType="next"
          value={values.newpassword}
          onBlur={handleBlur('newpassword')}
          onChangeText={handleChange('newpassword')}
          onSubmitEditing={focusConfirmPassword}
        />
        <MaterialInput
          isPassword
          error={touched.confirmpassword ? errors.confirmpassword : ''}
          label="Confirm New Password"
          maxLength={40}
          ref={confirmPasswordRef}
          returnKeyType="done"
          value={values.confirmpassword}
          onBlur={handleBlur('confirmpassword')}
          onChangeText={handleChange('confirmpassword')}
          onSubmitEditing={onUpdatePress}
        />
        <Title fontFamily="heading" fontSize="md" mt={10}>
          Two-step verification-Off
        </Title>
        <PrivacyItem
          title="Activate this feature for security"
          value={toggleValue}
          onToggle={toggleTwoStepVerification}
        />
        <Button
          borderRadius={20}
          height={10}
          isDisabled={!isFormValid}
          isLoading={isLoading}
          isLoadingText="Updating"
          mt={10}
          mx={3}
          onPress={onUpdatePress}>
          Update
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Security;
