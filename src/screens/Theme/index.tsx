import AsyncStorage from '@react-native-community/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Radio, Text, useColorMode, useTheme} from 'native-base';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {Container} from '../../components/UIComponents';
import {COLOR_MODE_KEY} from '../../constants/common';
import {RootStackParamList} from '../../navigation';

type IProps = NativeStackScreenProps<RootStackParamList, 'Theme'>;

type CurrentTheme = 'light' | 'dark' | 'systemDefault';

const THEME_OPTIONS = [
  {label: 'Light', value: 'light'},
  {label: 'Dark', value: 'dark'},
  {label: 'System default', value: 'systemDefault'},
];

function Theme(props: IProps) {
  const {navigation} = props;

  const theme = useTheme();

  const {colorMode, setColorMode} = useColorMode();

  const [currentTheme, setCurrentTheme] = useState<CurrentTheme>('systemDefault');

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Theme" />;
    navigation.setOptions({
      headerShown: true,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const loadCurrentTheme = useCallback(async () => {
    const mode = ((await AsyncStorage.getItem(COLOR_MODE_KEY)) || 'systemDefault') as CurrentTheme;
    if (mode) {
      setCurrentTheme(mode);
    }
    StatusBar.setBarStyle(colorMode === 'dark' ? 'light-content' : 'dark-content', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

  useEffect(() => {
    loadCurrentTheme();
  }, [loadCurrentTheme, theme.useSystemColorMode]);

  return (
    <Container style={styles.container}>
      {THEME_OPTIONS.map(option => {
        return (
          <TouchableOpacity
            key={option.value}
            style={styles.optionContainer}
            onPress={() => setColorMode(option.value)}>
            <Text>{option.label}</Text>
            <Radio.Group
              accessibilityLabel={`${option.label} theme option`}
              name={option.value}
              value={currentTheme}
              onChange={v => setColorMode(v)}>
              <Radio accessibilityLabel={`${option.label} theme option`} value={option.value} />
            </Radio.Group>
          </TouchableOpacity>
        );
      })}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  optionContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default Theme;
