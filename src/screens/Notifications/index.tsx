import React from 'react';
import {StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TabName} from 'react-native-collapsible-tab-view/lib/typescript/types';

import {TabBarProps, Tabs, MaterialTabBar} from 'react-native-collapsible-tab-view';

import {RootStackParamList} from '../../navigation';
import AllNotifications from './Tabs/AllNotification';
import Follows from './Tabs/Follows';
import Requests from './Tabs/Requests';
import Invites from './Tabs/Invites';
import {theme} from '../../theme';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';

export type NotificationScreenProps = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

function Notifications(props: NotificationScreenProps) {
  const {navigation} = props;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Notifications" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerTitle,
      headerRight: () => null,
    });
  }, [navigation]);

  const renderTabBar = (params: TabBarProps<TabName>) => {
    return (
      <MaterialTabBar
        {...params}
        activeColor={theme.colors.black[900]}
        contentContainerStyle={styles.tabContainerStyle}
        getLabelText={(name: TabName) => name.toString()}
        inactiveColor={theme.colors.black[300]}
        indicatorStyle={styles.tabBarIndicator}
        labelStyle={styles.tabBarLabel}
        scrollEnabled={false}
        style={styles.tabBar}
      />
    );
  };

  return (
    <Tabs.Container
      headerHeight={400}
      pagerProps={{keyboardShouldPersistTaps: 'always'}}
      renderTabBar={renderTabBar}>
      <Tabs.Tab name="All">
        <AllNotifications />
      </Tabs.Tab>
      <Tabs.Tab name="Follows">
        <Follows />
      </Tabs.Tab>
      <Tabs.Tab name="Requests">
        <Requests />
      </Tabs.Tab>
      <Tabs.Tab name="Invites">
        <Invites />
      </Tabs.Tab>
    </Tabs.Container>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.appWhite[700],
    textTransform: 'capitalize',
    height: 51,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'DMSans-Medium',
    color: theme.colors.black[900],
  },
  tabBarIndicator: {
    backgroundColor: theme.colors.red[900],
  },
  tabContainerStyle: {
    alignItems: 'center',
  },
});
export default Notifications;
