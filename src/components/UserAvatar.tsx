/**
 * @format
 */
import React from 'react';
import {useTheme, View} from 'native-base';
import {IViewProps} from 'native-base/lib/typescript/components/basic/View/types';

import {StyleSheet, ViewStyle} from 'react-native';
import {ImageStyle} from 'react-native-fast-image';
import {UserIcon, InfluencerIcon} from '../assets/svg';
import {ProgressImage} from './Common';

interface UserAvatarProps extends IViewProps {
  profilePic?: string;
  size?: number;
  influencerSize?: number;
  influencerIconStyle?: ViewStyle;
  isRounded?: boolean;
  containerStyle?: ViewStyle;
  style?: ImageStyle;
  influencerStatus?: boolean;
}

function UserAvatar(props: UserAvatarProps) {
  const {
    profilePic,
    size,
    style,
    isRounded,
    influencerIconStyle,
    influencerStatus,
    influencerSize,
    ...rest
  } = props;

  const {colors} = useTheme();

  const roundedStyle: ImageStyle = isRounded ? {borderRadius: size! / 2} : {borderRadius: 0};

  return (
    <View>
      <View
        style={[styles.avatar, {backgroundColor: colors.white, ...roundedStyle}]}
        {...rest}
        key={profilePic}>
        {profilePic && profilePic !== '' ? (
          <ProgressImage
            source={{uri: profilePic}}
            style={[styles.avatar, style, {height: size, width: size, ...roundedStyle}]}
          />
        ) : (
          <UserIcon height={size} width={size} />
        )}
      </View>
      {influencerStatus && (
        <View style={influencerIconStyle}>
          <InfluencerIcon height={influencerSize} width={influencerSize} />
        </View>
      )}
    </View>
  );
}

UserAvatar.defaultProps = {
  size: 40,
  profilePic: '',
  isRounded: true,
  influencerSize: 13,
  style: {},
  influencerStatus: false,
  containerStyle: {},
  influencerIconStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    overflow: 'hidden',
  },
});

export default UserAvatar;
