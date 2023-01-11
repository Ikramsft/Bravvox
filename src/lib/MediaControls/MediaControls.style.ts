import {StyleSheet} from 'react-native';
import {theme} from '../../theme';

const containerBackgroundColor = 'rgba(45, 59, 62, 0.4)';
const playButtonBorderColor = 'rgba(255,255,255,0.5)';
const white = '#fff';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: 0,

    paddingVertical: 13,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  controlsRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  fullScreenContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  playButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: playButtonBorderColor,
    borderRadius: 25,
    borderWidth: 1.5,
    height: 50,
    width: 50,
  },
  playIcon: {
    height: 40,
    resizeMode: 'contain',
    width: 40,
  },
  pausedIcon: {
    height: 22,
    resizeMode: 'contain',
    width: 22,
  },
  playView: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingRight: 20,
  },
  volumeButton: {
    alignItems: 'center',
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 20,
    width: 30,
  },
  progressColumnContainer: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: -14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  progressSlider: {
    alignSelf: 'stretch',
  },
  replayIcon: {
    height: 20,
    resizeMode: 'stretch',
    width: 25,
  },
  thumb: {
    backgroundColor: theme.colors.red[700],
    borderRadius: 6,
    borderWidth: 1,
    height: 12,
    width: 12,
  },
  timeRow: {
    alignSelf: 'stretch',
  },
  timerLabel: {
    color: white,
    fontSize: 12,
  },
  timerLabelsContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: -7,
  },
  toolbar: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
  },
  toolbarRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  track: {
    borderRadius: 1,
    height: 5,
  },
});
