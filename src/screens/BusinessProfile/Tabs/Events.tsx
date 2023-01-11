import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Tabs} from 'react-native-collapsible-tab-view';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    minHeight: 1000,
  },
});

function Events() {
  return (
    <Tabs.ScrollView contentContainerStyle={styles.content} style={styles.container}>
      <Text>Events</Text>
    </Tabs.ScrollView>
  );
}

export default Events;
