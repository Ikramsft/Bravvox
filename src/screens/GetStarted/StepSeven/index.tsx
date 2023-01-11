import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Text, useTheme, View} from 'native-base';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {RootStackParamList} from '../../../navigation';
import {updateIsLoginFirstTime} from '../../../redux/reducers/user/UserServices';
import AuthHeader from '../../Auth/Components/AuthHeader';
import {useUpdateFirstTime} from '../Queries/useUpdateFirstTime';
import StepHeader from '../StepHeader';

type Props = NativeStackScreenProps<RootStackParamList, 'GetStartedStepSeven'>;

function GetStartedStepSeven(props: Props) {
  const {navigation} = props;
  const {updateIsFirstTime} = useUpdateFirstTime();
  const dispatch = useDispatch();

  const {colors} = useTheme();

  const [loading, setLoading] = useState(false);

  const onFinish = async () => {
    setLoading(true);
    const response = await updateIsFirstTime({isFirstLogin: true});
    if (response.status === 200) {
      await dispatch(updateIsLoginFirstTime());
      setLoading(true);
    }
  };

  return (
    <SafeAreaView style={[styles.safeAreaView, {backgroundColor: colors.white}]}>
      <View style={styles.container}>
        <AuthHeader />
        <StepHeader onlyBack onBack={navigation.goBack} />
        <Text fontFamily="heading" fontSize={24} fontWeight="500" mt={1}>
          Welcome to <Text color="red.600">Bravvox.</Text>
        </Text>
        <Text fontSize={16} mt="2">
          Enter the world of Bravvox. A place built to give you complete freedom to connect,
          discover, and learn.
        </Text>
        <View alignItems="center" mt={15}>
          <Button
            _loading={{_text: {color: colors.white}}}
            backgroundColor={colors.black[1000]}
            isLoading={loading}
            mt="5"
            style={styles.buttonStyle}
            width="100%"
            onPress={onFinish}>
            Finish
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
    paddingTop: 0,
    padding: 20,
  },
  buttonStyle: {
    height: 45,
  },
});

export default GetStartedStepSeven;
