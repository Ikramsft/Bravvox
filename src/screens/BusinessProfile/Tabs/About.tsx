import React from 'react';
import {StyleSheet, Linking, useWindowDimensions, Platform} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {Tabs} from 'react-native-collapsible-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, theme} from 'native-base';

import {SubTitle, Title} from '../../../components/Typography';
import SafeTouchable from '../../../components/SafeTouchable';
import {getValue} from '../../../constants/common';
import {BusinessProfileScreenProps} from '..';
import {INewBusinessData} from '../types/BusinessInterfaces';
import {isValidHttpUrl} from '../../../utils';

interface IAboutProps extends BusinessProfileScreenProps {
  data: INewBusinessData | undefined;
}

function About(props: IAboutProps) {
  const {data} = props;
  const {width} = useWindowDimensions();
  const addressURL: any = Platform.select({
    ios: `maps:0,0?q=${data?.address}`,
    android: `geo:0,0?q=${data?.address}`,
  });

  const onWebURLClick = () => {
    Linking.openURL(isValidHttpUrl(data?.webUrl || ''));
  };
  const onAddressClick = () => {
    Linking.openURL(addressURL);
  };
  const onEmailClick = () => {
    Linking.openURL(`mailto:${data?.email}`);
  };
  const onPhoneClick = () => {
    Linking.openURL(`tel:${data?.phone}`);
  };
  if (!data) {
    return null;
  }

  return (
    <Tabs.ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View>
        <SubTitle color={theme.colors.black} fontSize="lg">
          About
        </SubTitle>
        {data?.about ? (
          <RenderHtml
            baseStyle={styles.baseStyle}
            contentWidth={width}
            source={{html: data?.about}}
            systemFonts={theme.fonts.body}
          />
        ) : (
          <Title color={theme.colors.gray[500]} fontSize="sm" fontWeight="normal">
            * No Description *
          </Title>
        )}
        {getValue(data, 'webUrl', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons color={theme.colors.gray[500]} name="web" size={17} />
            </View>
            <SafeTouchable onPress={onWebURLClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {data?.webUrl}
              </Title>
            </SafeTouchable>
          </View>
        )}
        {getValue(data, 'address', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <Ionicons color={theme.colors.gray[500]} name="md-location-outline" size={17} />
            </View>
            <SafeTouchable onPress={onAddressClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {data?.address}
              </Title>
            </SafeTouchable>
          </View>
        )}
        {getValue(data, 'email', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons
                color={theme.colors.gray[500]}
                name="email-outline"
                size={17}
              />
            </View>
            <SafeTouchable onPress={onEmailClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {data?.email}
              </Title>
            </SafeTouchable>
          </View>
        )}

        {data?.phone && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <Ionicons color={theme.colors.gray[500]} name="call-outline" size={17} />
            </View>
            <SafeTouchable onPress={onPhoneClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={4}>
                {data?.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
              </Title>
            </SafeTouchable>
          </View>
        )}
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
});
