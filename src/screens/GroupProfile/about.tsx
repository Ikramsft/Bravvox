import React from 'react';
import {StyleSheet, Linking, useWindowDimensions} from 'react-native';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {Tabs} from 'react-native-collapsible-tab-view';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {View, Divider, useTheme} from 'native-base';
import {GroupProfileScreenProps} from '.';
import {SubTitle, Title} from '../../components/Typography';
import {IGroupCardInfo} from '../Groups/types/GroupInterfaces';
import SafeTouchable from '../../components/SafeTouchable';
import {getValue} from '../../constants/common';
import {isValidHttpUrl} from '../../utils';

interface IAboutProps extends GroupProfileScreenProps {
  data: IGroupCardInfo | undefined;
}

const systemFonts = [...defaultSystemFonts, 'DMSans-Regular'];

function About(props: IAboutProps) {
  const {data} = props;
  const {width} = useWindowDimensions();

  const {colors} = useTheme();

  const onWebURLClick = () => {
    Linking.openURL(isValidHttpUrl(data?.webUrl || ''));
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
    <Tabs.ScrollView
      contentContainerStyle={styles.content}
      style={[styles.container, {backgroundColor: colors.white}]}>
      <View>
        <SubTitle color={colors.black[900]} fontSize="lg">
          About
        </SubTitle>
        {data?.about ? (
          <RenderHtml
            baseStyle={styles.baseStyle}
            contentWidth={width}
            source={{html: data?.about}}
            systemFonts={systemFonts}
            tagsStyles={{
              body: {
                color: colors.black[900],
                fontFamily: 'DMSans-Regular',
                fontSize: 14,
              }
            }}
          />
        ) : (
          <Title color={colors.gray[200]} fontSize="sm" fontWeight="normal">
            ** No Description **
          </Title>
        )}
        {getValue(data, 'webUrl', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons color={colors.gray[500]} name="web" size={17} />
            </View>
            <SafeTouchable onPress={onWebURLClick}>
              <Title _light={{color: colors.gray[200]}} fontWeight="normal" mx={4}>
                {data?.webUrl}
              </Title>
            </SafeTouchable>
          </View>
        )}
         {getValue(data, 'email', '') !== '' && (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <MaterialCommunityIcons color={colors.gray[500]} name="email-outline" size={17} />
            </View>
            <SafeTouchable onPress={onEmailClick}>
              <Title _light={{color: colors.gray[200]}} fontWeight="normal" mx={4}>
                {data?.email}
              </Title>
            </SafeTouchable>
          </View>
        )}
        {data?.phone ? (
          <View flexDirection="row" my={2}>
            <View justifyContent="center">
              <Ionicons color={colors.gray[500]} name="call-outline" size={17} />
            </View>
            <SafeTouchable onPress={onPhoneClick}>
              <Title _light={{color: colors.gray[200]}} fontWeight="normal" mx={4}>
                {data?.phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')}
              </Title>
            </SafeTouchable>
          </View>
        ) : null } 
        {data?.guidelines ? (
          <View pb={10}>
            <Divider my={2} />
            <SubTitle color={colors.black[900]} fontSize="lg" mt={3}>
              Guidelines
            </SubTitle>
            <RenderHtml
              baseStyle={styles.baseStyle}
              contentWidth={width}
              source={{html: data?.guidelines}}
              systemFonts={systemFonts}
              tagsStyles={{
                body: {
                  color: colors.black[900],
                  fontFamily: 'DMSans-Regular',
                  fontSize: 14,
                },
              }}
            />
          </View>
        ) : null}
      </View>
    </Tabs.ScrollView>
  );
}

export default About;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 100,
  },
  content: {
    minHeight: 1000,
  },
  baseStyle: {
    marginVertical: 15,
    fontSize: 15,
  },
});
