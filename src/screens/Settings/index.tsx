/**
 * @format
 */
import React, {useCallback} from 'react';
import {FlatList, useTheme, View} from 'native-base';
import {ListRenderItem} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {RootNavigationType} from '../Home';

import details from './settings.json';
import {ISettings, SettingsItem} from './SettingItem';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {Container} from '../../components/UIComponents';

function Settings() {
  const navigation = useNavigation<RootNavigationType>();

  const {colors} = useTheme();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Settings" />;

    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const data: ISettings[] = details as ISettings[];

  const keyExtractor = useCallback(
    (item: ISettings, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const onPress = (item: ISettings) => {
    switch (item.id) {
      case 'security':
        navigation.navigate('Security');
        break;
      case 'account_details':
        navigation.navigate('AccountDetails');
        break;
      case 'invite':
        navigation.navigate('InviteFriends');
        break;
      case 'notifications':
        navigation.navigate('NotificationSettings');
        break;
      case 'privacy':
        navigation.navigate('Privacy');
        break;
      case 'theme':
        navigation.navigate('Theme');
        break;
      default:
        break;
    }
  };

  const renderItem: ListRenderItem<ISettings> = ({item}) => (
    <SettingsItem item={item} key={item.id} onPress={onPress} />
  );

  const itemSeparatorComponent = () => (
    <View borderBottomColor={colors.black[50]} borderBottomWidth={1} />
  );

  return (
    <Container>
      <FlatList
        data={data}
        flex="1"
        ItemSeparatorComponent={itemSeparatorComponent}
        keyboardShouldPersistTaps="handled"
        keyExtractor={keyExtractor}
        pb="12"
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
      />
    </Container>
  );
}

export default Settings;
