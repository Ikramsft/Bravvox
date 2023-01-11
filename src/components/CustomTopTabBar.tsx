import React from 'react';
import {NavigationState, SceneRendererProps, TabBar} from 'react-native-tab-view';
import {Dimensions, StyleSheet} from 'react-native';
import {useTheme} from 'native-base';

type Route = {key: string; title: string};
type State = NavigationState<Route>;

const styles = StyleSheet.create({
  tabBarLabel: {
    fontSize: 14,
    fontFamily: 'DMSans-Medium',
    width: '100%',
    alignSelf: 'center',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
});

interface CustomTopTabBarProps extends SceneRendererProps {
  isConnection: boolean | undefined;
}

function CustomTopTabBar(props: CustomTopTabBarProps & {navigationState: State}) {
  const {colors} = useTheme();
  const tabBarLabelStyle = {
    color: colors.black[900],
  };
  const tabBarStyle = {
    backgroundColor: colors.trueGray[100],
  };
  const tabBarIndicatorStyle = {
    backgroundColor: colors.red[900],
    // eslint-disable-next-line react/destructuring-assignment
    width: Dimensions.get('window').width / (props.isConnection ? 6 : 4),
    marginRight: 18,
    marginLeft: 18,
    height: 3,
    borderRadius: 45,
  };
  return (
    <TabBar
      {...props}
      activeColor={colors.black['900']}
      inactiveColor={colors.black['300']}
      indicatorStyle={tabBarIndicatorStyle}
      labelStyle={[styles.tabBarLabel, tabBarLabelStyle]}
      style={tabBarStyle}
    />
  );
}

export default CustomTopTabBar;
