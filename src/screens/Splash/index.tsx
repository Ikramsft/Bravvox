import React from 'react';
import {View, StyleSheet} from 'react-native';
import Image from 'react-native-fast-image';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
// import {useDispatch, useSelector} from 'react-redux';
import {theme} from '../../theme';
import images from '../../assets/images';
import {RootStackParamList} from '../../navigation';
// import {RootState} from '../../redux/store';
// import {refreshAccessToken} from '../../redux/reducers/user/UserServices';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  logoImage: {
    height: 100,
    width: 100,
  },
});

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

function SplashScreen(props: Props) {
  return (
    <View style={styles.container}>
      <Image source={images.BRAVVOX_ICON} style={styles.logoImage} />
    </View>
  );
}

export default SplashScreen;
