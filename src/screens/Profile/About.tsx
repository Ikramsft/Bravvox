import React from 'react';
import {StyleSheet, Linking, useWindowDimensions, Platform} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {Tabs} from 'react-native-collapsible-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, theme, Text} from 'native-base';

import {SubTitle, Title} from '../../components/Typography';
import SafeTouchable from '../../components/SafeTouchable';
import {getValue} from '../../constants/common';

import {isValidHttpUrl} from '../../utils';
import {IUserData} from '../../redux/reducers/user/UserInterface';
import {ProfileScreenProps} from '.';

interface IAboutProps extends ProfileScreenProps {
  userInfo: IUserData;
}

function About(props: IAboutProps) {
  const {userInfo, navigation} = props;
  const {width} = useWindowDimensions();
  const addressURL: any = Platform.select({
    ios: `maps:0,0?q=${userInfo?.location}`,
    android: `geo:0,0?q=${userInfo?.location}`,
  });

  const onWebURLClick = () => {
    Linking.openURL(isValidHttpUrl(userInfo?.website || ''));
  };
  const onAddressClick = () => {
    Linking.openURL(addressURL);
  };
  // const onEmailClick = () => {
  //   Linking.openURL(`mailto:${userInfo?.email}`);
  // };
  const onPhoneClick = () => {
    Linking.openURL(`tel:${userInfo?.phone}`);
  };
  if (!userInfo) {
    return null;
  }

  const openVents = () => {
    navigation.navigate('Events');
  };

  return (
    <Tabs.ScrollView contentContainerStyle={styles.content}>
      <View style={styles.container}>
        <SubTitle color={theme.colors.black} fontSize="lg">
          About
        </SubTitle>
        {userInfo?.bio ? (
          <RenderHtml
            baseStyle={styles.baseStyle}
            contentWidth={width}
            source={{html: userInfo?.bio}}
            systemFonts={theme.fonts.body}
          />
        ) : (
          <Title color={theme.colors.gray[500]} fontSize="sm" fontWeight="normal">
            * No Description *
          </Title>
        )}
        {getValue(userInfo, 'website', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons color={theme.colors.gray[500]} name="web" size={17} />
            </View>
            <SafeTouchable onPress={onWebURLClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {userInfo?.website}
              </Title>
            </SafeTouchable>
          </View>
        )}
        {getValue(userInfo, 'location', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <Ionicons color={theme.colors.gray[500]} name="md-location-outline" size={17} />
            </View>
            <SafeTouchable onPress={onAddressClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {userInfo?.location}
              </Title>
            </SafeTouchable>
          </View>
        )}
        {/* {getValue(userInfo, 'email', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons
                name="email-outline"
                size={17}
                color={theme.colors.gray[500]}
              />
            </View>
            <SafeTouchable onPress={onEmailClick}>
              <Title color={theme.colors.blue[400]} fontWeight="normal" mx={4}>
                {userInfo?.email}
              </Title>
            </SafeTouchable>
          </View>
        )} */}
        {userInfo?.phone ? (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <Ionicons color={theme.colors.gray[500]} name="call-outline" size={17} />
            </View>
            <SafeTouchable onPress={onPhoneClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {userInfo?.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
              </Title>
            </SafeTouchable>
          </View>
        ) : null}

        <SubTitle color={theme.colors.black} fontSize="lg" marginTop={6}>
          Events
        </SubTitle>
        <View my={2}>
          <Text style={styles.eventTextStyle}>
            No Events,{' '}
            <Text color={theme.colors.blue[400]} onPress={openVents}>
              Click here for public events
            </Text>
          </Text>
        </View>
      </View>
    </Tabs.ScrollView>
  );
}

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.white,
  },
  content: {
    minHeight: 1000,
  },
  baseStyle: {
    marginVertical: 15,
    fontSize: 15,
    color: theme.colors.black,
  },
  eventTextStyle: {
    color: theme.colors.gray[500],
    marginVertical: 8,
  },
});
