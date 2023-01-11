import {useNavigation} from '@react-navigation/native';
import {useColorModeValue, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {DrawerNavigationType, RootNavigationType} from '../../screens/Home';
import {theme} from '../../theme';
import {ChatHandleIcon, NotificationHandleIcon, MenuHandleIcon} from '../../assets/svg';
import {Container} from '../../components/UIComponents';
import useUserInfo from '../../hooks/useUserInfo';

function HeaderLeft() {
  const navigation = useNavigation<DrawerNavigationType>();

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black[900], colors.appWhite[400]);

  return (
    <TouchableOpacity onPress={navigation.openDrawer}>
      <View style={styles.leftContainer}>
        <MenuHandleIcon color={iconColor} height={20} width={20} />
      </View>
    </TouchableOpacity>
  );
}

function HeaderRight() {
  const navigation = useNavigation<RootNavigationType>();

  const {colors} = useTheme();
  const iconColor = useColorModeValue(colors.black[900], colors.appWhite[400]);

  const {user} = useUserInfo();

  const gotoNotifications = () => navigation.navigate('Notifications');
  const gotoChat = () => navigation.navigate('ChatList');
  const gotoSearch = () => navigation.navigate('Search');

  return (
    <Container style={styles.rightContainer}>
      <TouchableOpacity onPress={gotoNotifications}>
        <View height={25} width={25}>
          <View style={styles.badge} />
          <NotificationHandleIcon color={iconColor} height={20} width={20} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatIcon} onPress={gotoChat}>
        <View height={25} width={25}>
          {user.haveNewMessages && <View style={styles.badge} />}
          <ChatHandleIcon color={iconColor} height={20} width={20} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.chatIcon} onPress={gotoSearch}>
        <View height={25} width={25}>
          <Feather color={iconColor} name="search" size={20} />
        </View>
      </TouchableOpacity>
    </Container>
  );
}

export const headerLeft = (/* props: headerLeftProps */) => <HeaderLeft /* {...props} */ />;
export const headerRight = (/* props: headerRightProps */) => <HeaderRight /* {...props} */ />;

const styles = StyleSheet.create({
  leftContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    width: 25,
    height: 25,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: 6,
  },
  chatIcon: {
    marginLeft: 10,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    borderRadius: 100,
    padding: 2.5,
    backgroundColor: theme.colors.red[900],
  },
});
