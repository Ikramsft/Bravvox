/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {useScrollToTop} from '@react-navigation/native';
import {StyleSheet} from 'react-native';

function Events() {
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Events;
