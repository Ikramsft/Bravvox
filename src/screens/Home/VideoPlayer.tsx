/**
 * @format
 */
import React, {useState, useEffect, useRef, MutableRefObject} from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {Box, IBoxProps, View} from 'native-base';
import Video, {OnLoadData, OnProgressData} from 'react-native-video';

import MediaControls, {PLAYER_STATES} from '../../lib/MediaControls';
import {theme} from '../../theme';

type IPlayerProps = {
  path: string;
  containerStyle?: IBoxProps;
  isSinglePostView?: boolean;
  // eslint-disable-next-line react/require-default-props
  onOutSidePress?: () => void;
};

function VideoPlayer(props: IPlayerProps) {
  const {path, containerStyle, isSinglePostView, onOutSidePress} = props;

  const videoPlayer = useRef() as MutableRefObject<Video>;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(true);
  const [volume, setVolume] = useState(1);
  const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);

  useEffect(() => {
    if (!isSinglePostView) {
      setPlayerState(PLAYER_STATES.PAUSED);
    } else {
      setPlayerState(PLAYER_STATES.PAUSED);
    }
  }, [isSinglePostView]);

  const onSeek = (seek: number) => videoPlayer?.current.seek(seek);

  const onFullScreen = () => setFullScreen(v => !v);

  const onFullScreenDismiss = () => {
    setPaused(true);
    setPlayerState(PLAYER_STATES.PAUSED);
    setFullScreen(false);
  };

  const onPaused = (newState: number) => {
    setPaused(!paused);
    setPlayerState(newState);
  };

  const onReplay = () => {
    videoPlayer?.current.seek(0);
    setCurrentTime(0);
    setPlayerState(PLAYER_STATES.PLAYING);
    setPaused(false);
  };

  const onProgress = (data: OnProgressData) => {
    if (!isLoading) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data: OnLoadData) => {
    setDuration(Math.round(data.duration));
    setIsLoading(false);
  };

  const onLoadStart = () => setIsLoading(true);

  const onEnd = () => {
    setPlayerState(PLAYER_STATES.ENDED);
    setCurrentTime(duration);
  };

  const loadingStyle: ViewStyle = isLoading ? {backgroundColor: theme.colors.black[1000]} : {};

  return (
    <Box bgColor={theme.colors.black[1000]} height="180" mt="2" width="100%" {...containerStyle}>
      <Video
        fullscreen={isFullScreen}
        muted={false}
        paused={paused}
        ref={videoPlayer}
        resizeMode="contain"
        source={{uri: path}}
        style={styles.video}
        volume={volume}
        onEnd={onEnd}
        onFullscreenPlayerWillDismiss={onFullScreenDismiss}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
      />

      <MediaControls
        containerStyle={loadingStyle}
        duration={duration}
        isFullScreen={isFullScreen}
        isLoading={isLoading}
        isSinglePostView={isSinglePostView}
        mainColor="#000"
        playerState={playerState}
        progress={currentTime}
        sliderStyle={{thumbStyle: {borderWidth: 0}}}
        toggleVolume={() => {
          setVolume(volume === 0 ? 1 : 0);
        }}
        volume={volume}
        onFullScreen={onFullScreen}
        onOutSidePress={onOutSidePress}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeek}>
        <MediaControls.Toolbar>
          <View />
        </MediaControls.Toolbar>
      </MediaControls>
    </Box>
  );
}

VideoPlayer.defaultProps = {
  containerStyle: {},
  isSinglePostView: false,
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.black,
  },
});

export {VideoPlayer};
