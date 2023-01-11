import {useNavigation} from '@react-navigation/native';
import {View, Image, Text} from 'native-base';
import React from 'react';
import {StyleSheet, TouchableOpacity, Share} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Config from 'react-native-config';
import {RootNavigationType} from '../Home';
import {showSnackbar} from '../../utils/SnackBar';
import {SubTitle} from '../../components/Typography';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {theme} from '../../theme';

function InviteFriends() {
  const navigation = useNavigation<RootNavigationType>();
  const inviteLink = `${Config.DEEP_LINK_URL}register`;

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Invite Friends" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerTitle,
      headerRight: () => null,
    });
  }, [navigation]);

  const copyLink = () => {
    Clipboard.setString(`${inviteLink}`);
    showSnackbar({message: 'Link Copied', type: 'info'});
  };

  const sleep = (time: number | undefined) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  const onShare = async () => {
    try {
      await sleep(500);
      await Share.share({
        message: `I'm inviting you to join Bravvox, Here is the link ${inviteLink}`,
        url: inviteLink,
        title: 'Welcome to BRAVVOX',
      });
    } catch (error) {
      showSnackbar({message: 'Something went wrong, try after sometimes', type: 'danger'});
    }
  };

  return (
    <View backgroundColor={theme.colors.white} flex={1} pt={3} px={5}>
      <KeyboardAwareScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.containerView}>
          <View style={styles.inviteTextView}>
            <Text color="black.500" fontSize={13}>
              Invite Link
            </Text>
            <Text>https://dev.bravvox.com/register</Text>
          </View>
          <TouchableOpacity style={styles.materialIcon} onPress={copyLink}>
            <MaterialIcons
              suppressHighlighting
              name="file-copy"
              size={20}
              style={styles.materialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareIcon} onPress={onShare}>
            <FontAwesome suppressHighlighting name="share-square-o" size={20} />
          </TouchableOpacity>
        </View>
        <View flex={1}>
          <SubTitle color={theme.colors.black[900]} fontFamily="heading" fontSize="md" mt={12}>
            Connect with your friends from other places
          </SubTitle>
          <View flex={1} flexDirection="row" justifyContent="space-between" mt={8} mx={4}>
            <Image
              alt="Alternate Text"
              borderRadius={100}
              size={50}
              source={{
                uri: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Facebook_Logo.png',
              }}
            />

            <Image
              alt="Alternate Text"
              borderRadius={100}
              size={50}
              source={{
                uri: 'https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png',
              }}
            />

            <View>
              <Text> How does this work?</Text>
              <Text underline alignSelf="center" color={theme.colors.blue[500]}>
                Click here
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default InviteFriends;

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'row',
  },
  inviteTextView: {
    flex: 1,
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderLeftWidth: 0.2,
    borderColor: theme.colors.gray[400],
    padding: 10,
  },
  materialIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    backgroundColor: theme.colors.gray[100],
    borderTopWidth: 0.2,
    borderBottomWidth: 0.2,
    borderRightWidth: 0.2,
    borderColor: theme.colors.gray[400],
  },
  shareIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
    marginLeft: 10,
  },
});
