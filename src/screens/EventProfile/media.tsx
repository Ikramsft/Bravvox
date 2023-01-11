import {Text} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';
import {theme} from '../../theme';
import {INewEventData} from '../Events/types/EventInterfaces';
import {EventProfileScreenProps} from './index';

interface IMediaProps extends EventProfileScreenProps {
  data: INewEventData | undefined;
}

function Media(props: IMediaProps) {
  const {data} = props;
  return (
    <Tabs.ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text>Media</Text>
    </Tabs.ScrollView>
  );
}

export default Media;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.white,
  },
  content: {
    // minHeight: 1000,
  },
});
