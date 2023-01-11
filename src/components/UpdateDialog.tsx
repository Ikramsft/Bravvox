import {Text, useTheme, View} from 'native-base';
import {StyleSheet} from 'react-native';
import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {UpdateIcon} from '../assets/svg';

import SafeTouchable from './SafeTouchable';

function UpdateDialog() {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <SafeTouchable
        activeOpacity={0.7}
        style={[styles.contentContainer, {backgroundColor: colors.primary['500']}]}
        onPress={() => {
          console.log('----->handle reload ');
        }}>
        <View style={styles.leftContainer}>
          <UpdateIcon height={28} width={28} />
          <View ml={2}>
            <Text color={colors.white} fontWeight="bold">
              Update Available
            </Text>
            <Text color={colors.white}>A new version of app is available</Text>
          </View>
        </View>

        <SimpleLineIcons color={colors.white} name="arrow-right" size={20} />
      </SafeTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    padding: 20,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default UpdateDialog;
