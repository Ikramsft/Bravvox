import React from 'react';
import {Text, Button, View} from 'native-base';
import {StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationType} from '../Home';
import {useUserLogout} from '../../redux/reducers/user/useUserLogout';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';

function Help() {
  const navigation = useNavigation<RootNavigationType>();

  const {logoutUser} = useUserLogout();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Help" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerTitle,
      headerRight: () => null,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>Help & Support</Text>
      <Button mt={2} size="lg" variant="outline" onPress={logoutUser}>
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Help;
