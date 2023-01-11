import React, {useState, useEffect} from 'react';
import {
  View,
  Animated,
  TouchableWithoutFeedback,
  GestureResponderEvent,
  ViewStyle,
} from 'react-native';
import styles from './MediaControls.style';
import {PLAYER_STATES} from './constants/playerStates';
import {Controls} from './Controls';
import {Slider, CustomSliderStyle} from './Slider';
import {Toolbar} from './Toolbar';

export type Props = {
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  duration: number;
  fadeOutDelay?: number;
  isFullScreen: boolean;
  hideControlsFirst?: number;
  isLoading: boolean;
  mainColor: string;
  onFullScreen?: (event: GestureResponderEvent) => void;
  onPaused: (playerState: PLAYER_STATES) => void;
  onReplay: () => void;
  onSeek: (value: number) => void;
  onSeeking: (value: number) => void;
  playerState: PLAYER_STATES;
  progress: number;
  showOnStart?: boolean;
  sliderStyle?: CustomSliderStyle;
  toolbarStyle?: ViewStyle;
  isSinglePostView: boolean | undefined;
  onOutSidePress?: () => void;
  volume: number;
  toggleVolume: () => void;
};

function MediaControls(props: Props) {
  const {
    children,
    containerStyle: customContainerStyle = {},
    duration,
    hideControlsFirst = false,
    fadeOutDelay = 5000,
    isLoading = false,
    mainColor = 'rgba(12, 83, 175, 0.9)',
    onFullScreen,
    onReplay: onReplayCallback,
    onSeek,
    onSeeking,
    playerState,
    progress,
    showOnStart = true,
    sliderStyle, // defaults are applied in Slider.tsx
    toolbarStyle: customToolbarStyle = {},
    isSinglePostView,
    onOutSidePress,
    volume,
    toggleVolume,
  } = props;
  const {initialOpacity, initialIsVisible} = (() => {
    if (showOnStart) {
      return {
        initialOpacity: 1,
        initialIsVisible: true,
      };
    }

    return {
      initialOpacity: 0,
      initialIsVisible: false,
    };
  })();

  const [opacity] = useState(new Animated.Value(initialOpacity));
  const [isVisible, setIsVisible] = useState(initialIsVisible);

  useEffect(() => {
    if (hideControlsFirst) {
      fadeOutControls(fadeOutDelay);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fadeOutControls = (delay = 0) => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 300,
      delay,
      useNativeDriver: false,
    }).start(result => {
      /* I noticed that the callback is called twice, when it is invoked and when it completely finished
      This prevents some flickering */
      if (result.finished) {
        setIsVisible(false);
      }
    });
  };

  const fadeInControls = (loop = true) => {
    setIsVisible(true);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      delay: 0,
      useNativeDriver: false,
    }).start(() => {
      if (loop) {
        fadeOutControls(fadeOutDelay);
      }
    });
  };

  const onReplay = () => {
    fadeOutControls(fadeOutDelay);
    onReplayCallback();
  };

  const cancelAnimation = () => opacity.stopAnimation(() => setIsVisible(true));

  const onPause = () => {
    const {playerState: pstate, onPaused} = props;
    const {PLAYING, PAUSED, ENDED} = PLAYER_STATES;
    switch (pstate) {
      case PLAYING: {
        cancelAnimation();
        break;
      }
      case PAUSED: {
        fadeOutControls(fadeOutDelay);
        break;
      }
      case ENDED:
        break;

      default:
        break;
    }

    const newPlayerState = playerState === PLAYING ? PAUSED : PLAYING;
    return onPaused(newPlayerState);
  };

  const toggleControls = () => {
    // value is the last value of the animation when stop animation was called.
    // As this is an opacity effect, I (Charlie) used the value (0 or 1) as a boolean
    if (PLAYER_STATES.PLAYING === playerState) {
      opacity.stopAnimation((value: number) => {
        setIsVisible(!!value);
        return value ? fadeOutControls() : fadeInControls();
      });
    } else if (!isSinglePostView) {
      if (onOutSidePress) {
        onOutSidePress();
      }
    } else {
      opacity.stopAnimation((value: number) => {
        setIsVisible(!!value);
        return value ? fadeOutControls() : fadeInControls();
      });
    }
  };

  return (
    <TouchableWithoutFeedback accessible={false} onPress={toggleControls}>
      <Animated.View style={[styles.container, customContainerStyle, {opacity}]}>
        {isVisible && (
          <View style={[styles.container, customContainerStyle]}>
            <View style={[styles.controlsRow, styles.toolbarRow, customToolbarStyle]}>
              {children}
            </View>

            {!isSinglePostView && (
              <Controls
                onPause={onPause}
                onReplay={onReplay}
                isLoading={isLoading}
                mainColor={mainColor}
                playerState={playerState}
              />
            )}

            {isSinglePostView ? (
              <Slider
                toggleVolume={toggleVolume}
                volume={volume}
                progress={progress}
                duration={duration}
                mainColor={mainColor}
                onFullScreen={onFullScreen}
                playerState={playerState}
                onSeek={onSeek}
                onSeeking={onSeeking}
                onPause={onPause}
                onReplay={onReplay}
                customSliderStyle={sliderStyle}
              />
            ) : (
              <View style={[styles.controlsRow, styles.toolbarRow, customToolbarStyle]} />
            )}
          </View>
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

MediaControls.Toolbar = Toolbar;

export default MediaControls;
