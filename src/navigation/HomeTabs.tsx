import {
  BottomTabBarProps,
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import React from 'react';
import {useColorModeValue, useTheme} from 'native-base';
import CustomTabBar from './Components/CustomTabBar';
import Events from '../screens/Events';
import Groups from '../screens/Groups';
import Home from '../screens/Home';
import Search from '../screens/Search';
import {headerLeft, headerRight} from './Components/Header';
import Popular from '../screens/Popular';
import {BravvoxLogoIcon} from '../assets/svg/index';
import HeaderTitle from '../components/HeaderTitle';
import ConnectWithPeople from '../screens/ConnectWithPeople';

export type HomeTabParamList = {
  Home: undefined;
  Popular: undefined;
  Groups: undefined;
  Events: undefined;
  Search: undefined;
  ConnectWithPeople: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <CustomTabBar {...props} />;

const options = {
  title: 'BRAVVOX',
  headerTitleAlign: 'center',
  headerLeft,
  headerRight,
  drawerLabel: () => null,
  drawerItemStyle: {height: 0},
};

function HomeTabs() {
  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black['900'], colors.appWhite['700']);

  const headerTitle = () => <HeaderTitle render={<BravvoxLogoIcon color={iconColor} />} />;

  return (
    <Tab.Navigator
      screenOptions={
        {
          tabBarHideOnKeyboard: true,
          ...options,
          headerTitle,
        } as BottomTabNavigationOptions
      }
      tabBar={renderTabBar}>
      <Tab.Screen component={Home} name="Home" />
      <Tab.Screen component={Popular} name="Popular" />
      <Tab.Screen component={Groups} name="Groups" />
      <Tab.Screen component={Events} name="Events" />
      <Tab.Screen component={Search} name="Search" options={{tabBarButton: () => null}} />
      <Tab.Screen
        component={ConnectWithPeople}
        name="ConnectWithPeople"
        options={{tabBarButton: () => null}}
      />
    </Tab.Navigator>
  );
}

export default HomeTabs;
