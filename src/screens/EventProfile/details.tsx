import {View, theme} from 'native-base';
import React from 'react';
import {Linking, Platform, StyleSheet, useWindowDimensions} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RenderHtml from 'react-native-render-html';
import {Title} from '../../components/Typography';
import {EventProfileScreenProps} from './index';
import SafeTouchable from '../../components/SafeTouchable';
import {getValue} from '../../constants/common';
import {dateFormatter} from '../../utils';
import {showSnackbar} from '../../utils/SnackBar';
import {INewEventData} from '../Events/types/EventInterfaces';

interface IDetailsProps extends EventProfileScreenProps {
  data: INewEventData | undefined;
}

function Details(props: IDetailsProps) {
  const {data} = props;
  const {width} = useWindowDimensions();

  const handleLinkingError = () => {
    showSnackbar({message: 'Unable to open location', type: 'danger'});
  };

  const onLocationClick = async () => {
    try {
      const url = data?.location || '';
      const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
      if (url.includes('http://') || url.includes('https://')) {
        Linking.openURL(url);
      } else {
        const queryLink = `${scheme}${url}`;
        Linking.openURL(queryLink);
      }
    } catch (error) {
      handleLinkingError();
    }
  };
  if (!data) {
    return <Tabs.Container />;
  }

  return (
    <Tabs.ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <View>
        {data?.details ? (
          <RenderHtml
            baseStyle={styles.baseStyle}
            contentWidth={width}
            source={{html: data?.details}}
            systemFonts={theme.fonts.body}
          />
        ) : (
          <Title color={theme.colors.gray[500]} fontSize="sm" fontWeight="normal">
            ** No Description **
          </Title>
        )}
        {getValue(data, 'eventStartTime', '') !== '' && (
          <View flexDirection="row" my={1}>
            <Ionicons color={theme.colors.gray[500]} name="time-outline" size={17} />
            <Title color={theme.colors.gray[500]} fontWeight="normal" mx={3}>
              Starts on{' '}
              {data?.eventStartTime && dateFormatter(data?.eventStartTime, 'EventDetails')}
            </Title>
          </View>
        )}
        {getValue(data, 'eventEndTime', '') !== '' && (
          <View flexDirection="row" my={1}>
            <Ionicons color={theme.colors.gray[500]} name="time-outline" size={17} />
            <Title color={theme.colors.gray[500]} fontWeight="normal" mx={3}>
              Ends on {data?.eventEndTime && dateFormatter(data?.eventEndTime, 'EventDetails')}
            </Title>
          </View>
        )}
        {data?.location && (
          <View flexDirection="row" my={1}>
            <View justifyContent="center">
              <Ionicons color={theme.colors.gray[500]} name="location-outline" size={17} />
            </View>
            <SafeTouchable onPress={onLocationClick}>
              <Title color={theme.colors.gray[500]} fontWeight="normal" mx={3}>
                {data?.location}
              </Title>
            </SafeTouchable>
          </View>
        )}
      </View>
    </Tabs.ScrollView>
  );
}

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: theme.colors.white,
  },
  content: {
    // minHeight: 1000,
  },
  baseStyle: {
    marginVertical: 15,
    fontSize: 15,
    color: theme.colors.black,
  },
});
