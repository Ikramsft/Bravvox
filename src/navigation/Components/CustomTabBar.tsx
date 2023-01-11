import {StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Box, View, IconButton, IIconButtonProps, useTheme, useColorModeValue} from 'native-base';

import {BravvoxBIcon} from '../../assets/svg/index';
import {EventIcon, GroupIcon, HomeIcon, PopularIcon} from './TabBarIcons';
import {useKeyboard} from '../../hooks/useKeyboard';
import {isAndroid} from '../../constants/common';

const ICONS: {[key: string]: JSX.Element} = {
  Home: HomeIcon,
  Popular: PopularIcon,
  Groups: GroupIcon,
  Events: EventIcon,
};

function TabIcon(props: IIconButtonProps) {
  const {colors} = useTheme();

  return <IconButton {...props} _pressed={{bg: 'red.800', _icon: {color: colors.white}}} />;
}

function CustomTabBar(props: BottomTabBarProps) {
  const {state, descriptors, navigation} = props;
  const {colors} = useTheme();

  const activeIconColor = useColorModeValue(colors.black['1000'], colors.appWhite['700']);
  const inActiveIconColor = useColorModeValue(colors.black['300'], colors.gray['200']);

  const {keyboardShown} = useKeyboard();

  const tabItems = state.routes.map((route, index) => {
    const {options} = descriptors[route.key];

    const isFocused = state.index === index;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        // The `merge: true` option makes sure that the params inside the tab screen are preserved
        navigation.navigate({
          name: route.name,
          merge: true,
          params: route.params,
        });
      }
    };

    const onLongPress = () => {
      navigation.emit({type: 'tabLongPress', target: route.key});
    };

    if (options.tabBarButton) {
      return options.tabBarButton({children: null});
    }

    return (
      <View key={route.key} style={styles.tabContainer}>
        {isFocused ? <View background="red.800" style={styles.indicator} /> : null}
        <TabIcon
          _icon={{color: isFocused ? activeIconColor : inActiveIconColor}}
          accessibilityLabel={options.tabBarAccessibilityLabel}
          accessibilityRole="button"
          accessibilityState={isFocused ? {selected: true} : {}}
          borderRadius="full"
          icon={ICONS[route.name]}
          key={route.key}
          mt={0.5}
          padding={2.5}
          testID={options.tabBarTestID}
          onLongPress={onLongPress}
          onPress={onPress}
        />
      </View>
    );
  });

  const addPostTab = (
    <View key="NewPost" py={1} style={styles.tabContainer}>
      <TabIcon
        _icon={{color: colors.white}}
        accessibilityRole="button"
        backgroundColor={colors.red['700']}
        borderRadius="full"
        icon={<BravvoxBIcon height={20} width={20} />}
        p={3}
        shadow={5}
        variant="solid"
        onPress={() => navigation.navigate('NewPost', {from: 'home'})}
      />
    </View>
  );

  tabItems.splice(2, 0, addPostTab);

  if (isAndroid && keyboardShown) {
    return null;
  }

  return (
    <Box
      safeAreaBottom
      _dark={{bg: 'black.40'}}
      _light={{bg: 'appWhite.600'}}
      backgroundColor="transparentWhite.100"
      bottom={0}
      position="absolute"
      px={5}
      shadow={5}
      width="full">
      <View style={styles.container}>{tabItems}</View>
    </Box>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: -3,
    right: 0,
    left: 0,
    height: 3,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});

export default CustomTabBar;
