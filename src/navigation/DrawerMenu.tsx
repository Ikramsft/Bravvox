import React, {useCallback} from 'react';
import {createDrawerNavigator, DrawerContentComponentProps} from '@react-navigation/drawer';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';

import {Text, View, Divider, FlatList, useTheme, useColorModeValue} from 'native-base';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {TouchableOpacity, StyleSheet, ListRenderItem} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeTabs from './HomeTabs';
import {theme} from '../theme';
import UserAvatar from '../components/UserAvatar';
import useUserInfo from '../hooks/useUserInfo';
import {useUserLogout} from '../redux/reducers/user/useUserLogout';
import {SCREEN_WIDTH} from '../constants/common';

import sidemenu from './sidemenu.json';
import SafeTouchable from '../components/SafeTouchable';
import {Title} from '../components/Typography';
import {GroupActiveIcon} from '../assets/svg/index';
import {truncateUsername} from '../utils';

export type DrawerParamList = {
  HomeTabs: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export type IconType =
  | 'SimpleLineIcons'
  | 'MaterialCommunityIcons'
  | 'Entypo'
  | 'Ionicons'
  | 'Groups'
  | '';

interface IDrawerItem {
  id: number;
  target: string;
  title: string;
  name: string;
  type: IconType;
  size: number;
  visible: boolean;
}

interface IDrawerItemProps {
  item: IDrawerItem;
  navigation: DrawerNavigationHelpers;
}

function DrawerItem(props: IDrawerItemProps) {
  const {item, navigation} = props;
  const {title, size, type, name, target} = item;

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['900'], colors.appWhite['700']);

  const Icon =
    type === 'Groups'
      ? GroupActiveIcon
      : type === 'Entypo'
      ? Entypo
      : type === 'Ionicons'
      ? Ionicons
      : type === 'SimpleLineIcons'
      ? SimpleLineIcons
      : type === 'MaterialCommunityIcons'
      ? MaterialCommunityIcons
      : MaterialCommunityIcons;

  const onPress = () => {
    navigation.closeDrawer();
    if (target === 'EditProfile') {
      navigation.navigate('EditProfile');
    } else {
      navigation.navigate(target);
    }
  };

  const key = `item-${item.id}`;

  return (
    <>
      <SafeTouchable key={key} onPress={onPress}>
        <View pb="3" pl="5" pr="5" pt="4">
          <View flexDirection="row">
            <View width="8">
              <Icon color={iconColor} name={name} size={size} />
            </View>
            <View style={styles.drawerItemRight}>
              <Title fontSize="md" fontWeight="normal" ml={3} numberOfLines={1}>
                {title}
              </Title>
            </View>
          </View>
        </View>
      </SafeTouchable>
      {item.id === 6 && <View mb={8} />}
    </>
  );
}

function DrawerWithLogoutButton(props: DrawerContentComponentProps) {
  const {navigation} = props;

  const {user} = useUserInfo();

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['900'], colors.appWhite['700']);

  const {logoutUser} = useUserLogout();

  const openUserProfile = () => {
    const {userName, documentId} = user;
    navigation.closeDrawer();
    navigation.navigate('Profile', {userName, userId: documentId});
  };

  const renderItem: ListRenderItem<IDrawerItem> = ({item}) => (
    <DrawerItem item={item} key={item.id} navigation={navigation} />
  );

  const keyExtractor = useCallback(
    (item: IDrawerItem, index: number) => `key-${index}-${item.id}`,
    [],
  );

  const data = (sidemenu as IDrawerItem[]).filter(m => m.visible);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeAreaView}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        ListHeaderComponent={
          <>
            <TouchableOpacity key="userdetails" onPress={openUserProfile}>
              <View key="userdetails-main" style={styles.listView}>
                <UserAvatar
                  influencerStatus={user.influencerStatus}
                  key="drawer-user-avatar"
                  profilePic={user.profilePic}
                  size={50}
                />
                <View key="userdetails-container" style={styles.profileHeader}>
                  <Text key="userdetails-displayname" noOfLines={1} style={styles.displayName}>
                    {user.name}
                  </Text>
                  <Text
                    _dark={{color: 'appWhite.400'}}
                    _light={{color: 'gray.500'}}
                    key="userdetails-username"
                    style={styles.username}>
                    @{truncateUsername(user.userName)}{' '}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Divider key="userdetails-divider" my={1} />
          </>
        }
        renderItem={renderItem}
      />
      <TouchableOpacity key="logout-user" onPress={logoutUser}>
        <View flexDirection="row" ml="5" my="6">
          <View width="8">
            <SimpleLineIcons color={iconColor} name="logout" size={19} />
          </View>
          <Title fontSize="md" fontWeight="normal" ml={3}>
            Log Out
          </Title>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const drawerContent = (props: DrawerContentComponentProps) => <DrawerWithLogoutButton {...props} />;

export default function DrawerScreens() {
  const width = SCREEN_WIDTH * 0.75;

  const {colors} = useTheme();
  const backgroundColor = useColorModeValue(colors.appWhite['600'], colors.black['40']);

  return (
    <Drawer.Navigator
      drawerContent={drawerContent}
      // eslint-disable-next-line react/no-unstable-nested-components
      screenOptions={{
        drawerStyle: {width, backgroundColor},
        drawerType: 'front',
      }}>
      <Drawer.Screen
        component={HomeTabs}
        name="HomeTabs"
        options={{headerShown: false, drawerLabel: () => null, drawerItemStyle: {height: 0}}}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  displayName: {
    fontSize: 17,
    fontFamily: 'DMSans-Medium',
  },
  username: {
    fontSize: 14,
    fontFamily: 'DMSans-Regular',
  },
  listView: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  profileHeader: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 15,
  },
  drawerItemRight: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
