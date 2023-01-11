/**
 * @format
 */
import React, {useMemo} from 'react';
import {Button, View, Divider, Spinner} from 'native-base';
import {FormikProps, useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationType} from '../Home';
import {PrivacyItem} from '../Groups/AddGroup/PrivacyItem';
import {Title} from '../../components/Typography';
import {theme} from '../../theme';
import {useFetchPrivacy} from './Queries/useFetchPrivacy';
import Error from '../../components/Error';
import {IPrivacySetting, useSubmitPrivacySetting} from './Queries/useSubmitPrivacySetting';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';

function Privacy() {
  const navigation = useNavigation<RootNavigationType>();

  const {data: privacyData, isLoading, isError, refetch} = useFetchPrivacy();
  const {handlePrivacySettingUpdate} = useSubmitPrivacySetting();
  
  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Privacy" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation, privacyData]);

  const onSubmit = React.useCallback(
    async (values: IPrivacySetting) => {
      try {
        handlePrivacySettingUpdate(values);
      } catch (error) {
        //
      }
    },
    [handlePrivacySettingUpdate],
  );

  const initialValues = {
    auto_approve_follower: privacyData?.data?.auto_approve_follower
      ? privacyData?.data?.auto_approve_follower
      : false,
    cmc: privacyData?.data?.cmc,
    notification_preference: privacyData?.data?.notification_preference,
    privacy: privacyData?.data?.privacy,
    relationship_notification_on: privacyData?.data?.relationship_notification_on,
    set_follower: privacyData?.data?.set_follower,
    set_subscriber: privacyData?.data?.set_subscriber,
  };
  const formik: FormikProps<IPrivacySetting> = useFormik<IPrivacySetting>({
    initialValues,
    validateOnChange: false,
    enableReinitialize: true,
    onSubmit,
  });
  const {handleSubmit, values, setFieldValue} = formik;

  const isValidData = useMemo(() => {
    const responseResult = privacyData?.data?.auto_approve_follower
      ? privacyData?.data?.auto_approve_follower
      : false;
    return values.auto_approve_follower !== responseResult;
  }, [privacyData?.data?.auto_approve_follower, values.auto_approve_follower]);

  const togglePrivacy = (key: keyof IPrivacySetting) => () => {
    const currentValue = values[key];
    setFieldValue(key, !currentValue);
  };
  if (isLoading) {
    return <Spinner mb={20} mt={20} />;
  }

  if (isError) {
    return <Error retry={refetch} />;
  }

  return (
    <View backgroundColor={theme.colors.white} flex={1} pt={3} px={5}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <Title fontFamily="heading" fontSize="xl" mt={10}>
          Follower Settings
        </Title>
        <Divider mb={0} my={3} />
        <PrivacyItem
          color={theme.colors.black[900]}
          title="Require my approval for people to follow me"
          value={!values.auto_approve_follower}
          width="80%"
          onToggle={togglePrivacy('auto_approve_follower')}
        />
        <Divider mb={0} my={3} />
        <Button height={10} isLoadingText="Deleting" mt={5} width="45%" onPress={() => null}>
          Delete Profile
        </Button>
        <View flexDirection="row" justifyContent="space-between">
          <Button
            bg="#d3d3d3"
            borderRadius={20}
            height={10}
            isLoadingText="Updating"
            mt={10}
            width="45%"
            onPress={() => {
              navigation.goBack();
            }}>
            Cancel
          </Button>
          <Button
            borderRadius={20}
            height={10}
            isDisabled={!isValidData}
            isLoadingText="Updating"
            mt={10}
            width="45%"
            onPress={() => handleSubmit()}>
            Update
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default Privacy;
