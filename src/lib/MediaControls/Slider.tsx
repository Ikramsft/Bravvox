import React from 'react';
import {TouchableOpacity, View, Text, Image, ViewStyle} from 'react-native';
import RNSlider from 'react-native-slider';
import styles from './MediaControls.style';
import {Props as MediaControlsProps} from './MediaControls';
import {PLAYER_STATES} from './constants/playerStates';
import fullScreenImage from './assets/ic_fullscreen.png';
import pauseImage from './assets/ic_pause_white.png';
import playImage from './assets/ic_play_white.png';
import volumeImage from './assets/ic_volume.png';
import volumeOffImage from './assets/ic_volume_off.png';

import {theme} from '../../theme';

export type CustomSliderStyle = {
  containerStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  thumbStyle?: ViewStyle;
};

type Props = Pick<
  MediaControlsProps,
  'progress' | 'duration' | 'mainColor' | 'onFullScreen' | 'playerState' | 'onSeek' | 'onSeeking'
> & {
  onPause: () => void;
  customSliderStyle?: CustomSliderStyle;
  onReplay: () => void;
  volume: number;
  toggleVolume: () => void;
};

function Slider(props: Props) {
  const {
    customSliderStyle,
    duration,
    mainColor,
    onFullScreen,
    onPause,
    progress,
    playerState,
    onReplay,
    volume,
    toggleVolume,
  } = props;

  const containerStyle = customSliderStyle?.containerStyle || {};
  const customTrackStyle = customSliderStyle?.trackStyle || {};
  const customThumbStyle = customSliderStyle?.thumbStyle || {};

  const dragging = (value: number) => {
    const {onSeeking} = props;
    onSeeking(value);

    if (playerState === PLAYER_STATES.PAUSED) {
      return;
    }

    onPause();
  };

  const seekVideo = (value: number) => {
    const {onSeek} = props;
    onSeek(value);
    onPause();
  };

  const pressAction = playerState === PLAYER_STATES.ENDED ? onReplay : onPause;

  return (
    <View style={styles.progressContainer}>
      <TouchableOpacity onPress={pressAction} style={styles.playView}>
        {playerState === PLAYER_STATES.PLAYING ? (
          <Image source={pauseImage} />
        ) : (
          <Image source={playImage} />
        )}
      </TouchableOpacity>

      <View style={[styles.progressColumnContainer]}>
        <RNSlider
          style={styles.progressSlider}
          onValueChange={dragging}
          onSlidingComplete={seekVideo}
          maximumValue={Math.floor(duration)}
          value={Math.floor(progress)}
          trackStyle={[styles.track, customTrackStyle]}
          thumbStyle={[styles.thumb, customThumbStyle, {borderColor: mainColor}]}
          minimumTrackTintColor={theme.colors.red[700]}
        />
      </View>
      <TouchableOpacity onPress={toggleVolume} style={styles.volumeButton}>
        {volume === 0 ? <Image source={volumeOffImage} /> : <Image source={volumeImage} />}
      </TouchableOpacity>
      {Boolean(onFullScreen) && (
        <TouchableOpacity style={styles.fullScreenContainer} onPress={onFullScreen}>
          <Image source={fullScreenImage} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export {Slider};
