/**
 * @format
 */
import React from 'react';
import {View, Text, Switch, Spinner} from 'native-base';

import {useProfileStatus} from './useProfileStatus';
import {useUpdateOnlineStatus} from './useUpdateOnlineStatus';
import SafeTouchable from '../../../components/SafeTouchable';
import {useUpdateMuteStatus} from './useUpdateMuteStatus';

interface IProfileStatusOptionProps {
  showOption: boolean;
}

function ProfileStatusOptions(props: IProfileStatusOptionProps) {
  const {showOption} = props;

  const {isLoading, data: profileStatus} = useProfileStatus();

  const {isLoading: updatingOnline, tryUpdateOnlineStatus} = useUpdateOnlineStatus();
  const {isLoading: updatingMute, tryUpdateMuteStatus} = useUpdateMuteStatus();

  const onToggleOnline = () => tryUpdateOnlineStatus({online: !profileStatus?.onlineIndicator});

  const onToggleMute = () =>
    tryUpdateMuteStatus({reqType: profileStatus?.isMuted ? 'unmute' : 'mute'});

  if (showOption && isLoading) {
    return <Spinner my={3} />;
  }

  if (showOption) {
    return (
      <View flexDirection="row" key="online-indicator" my={2} py={1}>
        <View
          alignItems="center"
          flex={0.5}
          flexDirection="row"
          justifyContent="space-around"
          px={2}>
          <Text>Online Indicator</Text>
          <SafeTouchable activeOpacity={0.8} disabled={updatingOnline} onPress={onToggleOnline}>
            <View pointerEvents="none">
              <Switch isChecked={profileStatus?.onlineIndicator} pointerEvents="none" />
            </View>
          </SafeTouchable>
        </View>
        <View
          alignItems="center"
          flex={0.5}
          flexDirection="row"
          justifyContent="space-around"
          px={2}>
          <Text>Mute Notifications</Text>
          <SafeTouchable activeOpacity={0.8} disabled={updatingMute} onPress={onToggleMute}>
            <View pointerEvents="none">
              <Switch isChecked={profileStatus?.isMuted} />
            </View>
          </SafeTouchable>
        </View>
      </View>
    );
  }

  return null;
}

export {ProfileStatusOptions};
