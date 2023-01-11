/**
 * @format
 */
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, useColorModeValue, useTheme, View} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SnapSlider from '@elselabs/react-native-snap-slider';

import {RootStackParamList} from '../../../navigation';
import AuthHeader from '../../Auth/Components/AuthHeader';
import {Caption} from '../../../components/Typography';
import {SCREEN_WIDTH, isAndroid} from '../../../constants/common';
import {useSettings} from '../Queries/useSettings';
import {useUpdateSettings} from '../Queries/useUpdateSettings';
import StepHeader from '../StepHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStartedStepSix'>;

type Steps = {[key: number]: string};
const STEP_LABEL: Steps = {
  1: 'Content that is generally suitable for all ages.',
  2: 'Content that will include sensitive topics and images.',
  3: 'All content allowed on Bravvox.',
};

const TotalSteps = 3;
const sliderOptions = Array.from({length: TotalSteps}, (_, i) => ({value: i + 1, label: i + 1}));
function GetStartedStepSix(props: Props) {
  const {navigation} = props;
  const {colors} = useTheme();
  const {updateSettings} = useUpdateSettings();
  const {data: settings} = useSettings();
  const [step, setStep] = useState<keyof Steps>(3);
  const [loading, setLoading] = useState(false);

  const handleBack = () => navigation.goBack();
  const handleSkip = () => navigation.navigate('GetStartedStepSeven');

  const onValueChange = (value: number) => setStep(value + 1);

  React.useEffect(() => {
    if (settings?.data?.cmc) {
      setStep(settings?.data?.cmc);
    }
  }, [settings?.data?.cmc]);

  const onSubmit = async () => {
    setLoading(true);
    const data = {
      auto_approve_follower: false,
      cmc: step,
      notification_preference: 'email',
      privacy: 'public',
      relationship_notification_on: false,
      set_follower: true,
      set_subscriber: true,
    };
    const response = await updateSettings(data);
    if (response.status === 200) {
      navigation.navigate('GetStartedStepSeven');
    }
    setLoading(false);
  };

  const stepText = STEP_LABEL[step];

  const itemColor = useColorModeValue(colors.black['40'], colors.white);

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader step="5" totalStep="5" onBack={handleBack} />
        <View mb="6">
          <Text fontFamily="heading" fontSize={24} fontWeight="500">
            Control My Content
          </Text>
          <Text fontFamily="body" fontSize={16} fontWeight="normal" mt="2">
            Control what content is allowed on your timeline and feeds.
          </Text>
        </View>
        <View>
          <SnapSlider
            defaultItem={step - 1}
            items={sliderOptions}
            itemStyle={[styles.itemStyle, {color: itemColor}]}
            labelPosition="bottom"
            minimumTrackTintColor={colors.primary[500]}
            style={isAndroid ? styles.sliderStyle : {}}
            thumbTintColor={colors.primary[500]}
            onSlidingComplete={onValueChange}
          />
          <Text fontFamily="body" fontSize={16} fontWeight="bold" mt="6">
            {stepText}
          </Text>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <Button
          backgroundColor={colors.black[1000]}
          isLoading={loading}
          style={styles.buttonStyle}
          width="100%"
          onPress={onSubmit}>
          Next
        </Button>
        <TouchableOpacity onPress={handleSkip}>
          <Caption mt="2">Skip this step</Caption>
        </TouchableOpacity>
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
    paddingTop: 0,
    padding: 20,
  },
  actionContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonStyle: {
    height: 45,
  },
  sliderStyle: {
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
  },
  itemStyle: {
    paddingHorizontal: isAndroid ? 4 : 10,
  },
});

export default GetStartedStepSix;
