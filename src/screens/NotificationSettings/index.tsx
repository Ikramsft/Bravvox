import {useNavigation} from '@react-navigation/native';
import {theme, ScrollView, Button} from 'native-base';
import React from 'react';
import {RootNavigationType} from '../Home';
import {INotificationFormType, useNotificationForm} from './useNotificationForm';
import NotificationForm from './NotificationFrom';
import {useNotificationUpdate} from './Queries/useNotificationUpdate';
import HeaderLeft from '../../components/HeaderLeft';

function NotificationSettings() {
  const navigation = useNavigation<RootNavigationType>();
  const {handleNotificationUpdate} = useNotificationUpdate();
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit = async (values: INotificationFormType) => {
    handleNotificationUpdate(values);
  };
  const formik = useNotificationForm(onSubmit);
  const {handleSubmit} = formik;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;

    navigation.setOptions({
      headerShown: true,
      headerLeft,
      headerTitleAlign: 'center',
      title: 'Notifications',
      headerRight: () => null,
    });
  }, [navigation]);

  const onUpdateSettings = () => handleSubmit();

  return (
    <ScrollView backgroundColor={theme.colors.white} flex={1} pt={3} px={5}>
      <NotificationForm formik={formik} />
      <Button borderRadius={20} height={10} mb={10} mt={10} mx={3} onPress={onUpdateSettings}>
        Update
      </Button>
    </ScrollView>
  );
}

export default NotificationSettings;
