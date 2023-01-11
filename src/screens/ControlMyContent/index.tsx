/**
 * @format
 */
import React, {useMemo, useState} from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import {Button, Text, useTheme, View} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import SnapSlider from '@elselabs/react-native-snap-slider';

import {isNumber, toNumber} from 'lodash';
import {useQueryClient} from 'react-query';
import {RootStackParamList} from '../../navigation';
import {SCREEN_WIDTH, isAndroid} from '../../constants/common';
import {useSettings} from '../GetStarted/Queries/useSettings';
import {useUpdateSettings} from '../GetStarted/Queries/useUpdateSettings';
import HeaderLeft from '../../components/HeaderLeft';
import HeaderTitle from '../../components/HeaderTitle';
import {QueryKeys} from '../../utils/QueryKeys';

type Props = NativeStackScreenProps<RootStackParamList, 'ControlMyContent'>;

function getLabel(data: number) {
  switch (data) {
    case 1:
      return 'Content that is generally suitable for all ages.';
    case 2:
      return 'Content that will include sensitive topics and images.';
    case 3:
      return 'All content allowed on Bravvox.';
    default:
      return '';
  }
}

const TotalSteps = 3;
const sliderOptions = Array.from({length: TotalSteps}, (_, i) => ({value: i + 1, label: i + 1}));
function ControlMyContent(props: Props) {
  const queryClient = useQueryClient();
  const {navigation} = props;
  const theme = useTheme();
  const {updateSettings} = useUpdateSettings();
  const {data: settings, isLoading} = useSettings();
  const [step, setStep] = useState<number>(3);
  const [sliderShow, setSliderShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onValueChange = (value: number) => {
    setStep(value + 1);
  };

  const stepText = getLabel(step);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Control My Settings" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerLeft,
      headerTitle,
      headerRight: () => null,
    });
  }, [navigation]);

  React.useEffect(() => {
    const onBlur = () => {
      const cacheKey = QueryKeys.stepSetting;
      queryClient.invalidateQueries(cacheKey);
    };
    const unsubscribe = navigation.addListener('beforeRemove', onBlur);
    return () => unsubscribe();
  }, [navigation, queryClient]);

  React.useEffect(() => {
    if (isNumber(settings?.data?.cmc)) {
      // setStep(toNumber(settings?.data?.cmc) + 1);
      setStep(settings?.data?.cmc);
      setSliderShow(true);
    }
  }, [settings?.data?.cmc]);

  const onSubmit = async () => {
    setLoading(true);

    let data = {
      auto_approve_follower: false,
      cmc: step,
      notification_preference: 'email',
      privacy: 'public',
      relationship_notification_on: false,
      set_follower: true,
      set_subscriber: true,
    };
    if (settings?.data) {
      data = {
        ...settings?.data,
        cmc: step,
      };
    }
    const response = await updateSettings(data);
    if (response.status === 200) {
      navigation.goBack();
    }

    setLoading(false);
  };

  const noChange = useMemo(
    () => step === toNumber(settings?.data?.cmc),
    [settings?.data?.cmc, step],
  );

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.safeAreaView, {backgroundColor: theme.colors.white}]}>
      <View style={styles.container}>
        <View mb="6" mt="2">
          <Text fontFamily="body" fontSize={16} fontWeight="normal" mt="2">
            Control what content is allowed on your timeline and feeds by adjusting the slider
            below.
          </Text>
        </View>
        {!sliderShow || isLoading ? (
          <View>
            <ActivityIndicator color={theme.colors.primary[500]} size="small" />
          </View>
        ) : (
          <View>
            <SnapSlider
              defaultItem={step - 1}
              items={sliderOptions}
              itemStyle={styles.itemStyle}
              labelPosition="bottom"
              minimumTrackTintColor={theme.colors.primary[500]}
              style={isAndroid ? styles.sliderStyle : {}}
              thumbTintColor={theme.colors.primary[500]}
              onSlidingComplete={onValueChange}
            />
            <Text fontFamily="body" fontSize={16} fontWeight="bold" mt="6">
              {stepText}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.actionContainer}>
        <Button
          backgroundColor={theme.colors.black[1000]}
          isDisabled={!sliderShow || isLoading || loading || noChange}
          isLoading={isLoading || loading}
          style={styles.buttonStyle}
          width="100%"
          onPress={onSubmit}>
          Update
        </Button>
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
    paddingBottom: 20,
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

export default ControlMyContent;
