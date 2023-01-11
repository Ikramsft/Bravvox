import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Image, View, Text, useTheme, useColorMode, useColorModeValue} from 'native-base';
import React from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import images from '../../../assets/images/index';
import {BravvoxBRedIcon} from '../../../assets/svg';
import {RootStackParamList} from '../../../navigation';

const LIGHT_GRADIENT = ['rgba(255,255,255,0)', 'rgba(255,255,255,1)'];
const DARK_GRADIENT = ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'];

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

function Landing({navigation}: Props) {
  const {width, height} = useWindowDimensions();

  const {colors} = useTheme();
  const backgroundColor = useColorModeValue(colors.white, colors.black['40']);
  const gradientColors = useColorModeValue(LIGHT_GRADIENT, DARK_GRADIENT);

  const createAccount = () => navigation.replace('SignUp');
  const logIn = () => navigation.replace('Login');

  return (
    <SafeAreaView edges={['bottom']} mode="padding" style={[styles.container, {backgroundColor}]}>
      <StatusBar hidden />
      <View style={styles.topsection}>
        <Image
          alt="LANDING_BACKGROUND"
          source={images.LANDING_BACKGROUND}
          style={[styles.landingImage, {width, height: (height * 2) / 3}]}
        />

        <LinearGradient
          colors={gradientColors}
          end={{x: 0, y: 1}}
          start={{x: 0, y: 0}}
          style={styles.liniearGradient}
        />
      </View>

      <View style={[styles.bottomSection, {backgroundColor}]}>
        <View style={styles.logoView}>
          <BravvoxBRedIcon height={40} width={40} />
        </View>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>Welcome to Bravvox</Text>
        </View>
        <View style={styles.taglineView}>
          <Text style={styles.tagline}>
            A space to connect with friends and loved ones while discovering new ideas.
          </Text>
        </View>
        <View style={styles.buttonView}>
          <View mt={4}>
            <Button
              backgroundColor={colors.black[1000]}
              style={[styles.buttonStyle, styles.buttonWidth]}
              onPress={createAccount}>
              Create Account
            </Button>
            <TouchableOpacity style={styles.buttonStyle} onPress={logIn}>
              <Text>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topsection: {
    flex: 2,
    position: 'relative',
  },
  bottomSection: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 1124,
  },
  logoView: {
    marginBottom: 12,
  },
  titleView: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'DMSans-Medium',
  },
  taglineView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  tagline: {
    textAlign: 'center',
    fontFamily: 'DMSans-Regular',
    fontWeight: '400',
    fontSize: 16,
  },
  buttonView: {
    paddingVertical: 10,
  },
  buttonStyle: {
    marginVertical: 5,
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWidth: {
    width: 155,
  },
  landingImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  liniearGradient: {
    position: 'absolute',
    zIndex: 1122,
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
});

export default Landing;
