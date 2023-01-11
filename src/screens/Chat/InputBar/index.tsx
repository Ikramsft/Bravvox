/**
 * @format
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import {View, Spinner} from 'native-base';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {InputToolbar, Composer, ComposerProps, InputToolbarProps} from 'react-native-gifted-chat';

import {theme} from '../../../theme';
import UserAvatar from '../../../components/UserAvatar';
import SafeTouchable from '../../../components/SafeTouchable';

interface IAccessoryProps {
  profilePic: string;
  disabled: boolean;
  loading: boolean | undefined;
  onSend: () => void;
}

function RenderAccessory(props: IAccessoryProps) {
  const {profilePic, loading, disabled, onSend} = props;
  return (
    <View alignItems="center" flexDirection="row" justifyContent="space-between" pl={2}>
      <UserAvatar profilePic={profilePic} />
      <SafeTouchable disabled={disabled} onPress={onSend}>
        {loading ? (
          <Spinner mt={2} />
        ) : (
          <Ionicon color={theme.colors.gray[400]} name="send-outline" size={20} />
        )}
      </SafeTouchable>
    </View>
  );
}

function RenderComposer(props: IRenderProps) {
  const {disabled} = props;
  return (
    <Composer
      {...props}
      disableComposer={disabled}
      placeholder="Write a message..."
      textInputProps={{maxLength: 5000}}
      textInputStyle={styles.textInputStyles}
    />
  );
}

export interface IRenderProps extends ComposerProps {
  disabled: boolean | undefined;
}

export interface IInputBarProps extends InputToolbarProps {
  disabled: boolean | undefined;
}

function CustomInputToolbar(props: IInputBarProps) {
  const {disabled} = props;

  const renderComposer = (cProps: ComposerProps) => {
    return <RenderComposer {...cProps} disabled={disabled} />;
  };

  return (
    <InputToolbar
      {...props}
      containerStyle={styles.toolbarContainerStyle}
      renderComposer={renderComposer}
    />
  );
}

const styles = StyleSheet.create({
  textInputStyles: {
    marginTop: 6,
    height: 50,
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
  },
  toolbarContainerStyle: {
    paddingHorizontal: 20,
  },
});

export {RenderAccessory, CustomInputToolbar};
