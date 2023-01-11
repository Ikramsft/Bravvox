import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text, useTheme, View} from 'native-base';
import React from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {RootStackParamList} from '../../../navigation';
import {theme} from '../../../theme';
import AuthHeader from '../../Auth/Components/AuthHeader';
import StepHeader from '../StepHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'CheckEmail'>;

function GetStartedStepTwo(props: Props) {
  const {navigation} = props;

  const {colors} = useTheme();

  const onContinue = () => navigation.navigate('GetStartedStepThree');

  const handleBack = () => navigation.goBack();

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader onlyBack onBack={handleBack} />
        <Text fontFamily="heading" fontSize={24} fontWeight="500" mt={3}>
          Make Bravvox <Text color="red.700">yours.</Text>
        </Text>
        <Text fontSize={16} mt="2">
          We curate content based on your interests. It'll only take a few minutes to make Bravvox
          yours.
        </Text>
        <View alignItems="center" mt={15}>
          <Button
            backgroundColor={theme.colors.black[1000]}
            mt="5"
            style={styles.buttonStyle}
            width="100%"
            onPress={onContinue}>
            Next
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
  },
  buttonStyle: {
    height: 45,
    borderWidth: 1,
  },
});

export default GetStartedStepTwo;
