/**
 * @format
 */

import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Actionsheet, useDisclose} from 'native-base';
import {Keyboard} from 'react-native';

interface IPickerProps {
  isMuted?: boolean;
  onToggleMute?: () => void;
  onSelectBlock?: () => void;
  onSelectDelete?: () => void;
  onCloseOptions?: () => void;
}

type IPressHandler = {
  showOptions: () => void;
};

const MessageListOptions = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  useImperativeHandle(ref, () => ({showOptions}));

  const showOptions = () => {
    Keyboard.dismiss();
    onOpen();
  };

  const {isOpen, onOpen, onClose} = useDisclose();

  const {isMuted, onToggleMute, onSelectBlock, onCloseOptions, onSelectDelete} = props;

  const toggleMuteConversation = () => {
    onClose();
    if (onToggleMute) {
      onToggleMute();
    }
  };

  const deleteConversation = () => {
    onClose();
    if (onSelectDelete) {
      onSelectDelete();
    }
  };

  const block = () => {
    onClose();
    if (onSelectBlock) {
      onSelectBlock();
    }
  };

  const onSheetClose = () => {
    onClose();
    if (onCloseOptions) {
      onCloseOptions();
    }
  };

  const muteUnmuteText = isMuted ? 'Unmute Conversation' : 'Mute Conversation';

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onSheetClose}>
        <Actionsheet.Content>
          <Actionsheet.Item py="3" onPress={toggleMuteConversation}>
            {muteUnmuteText}
          </Actionsheet.Item>
          <Actionsheet.Item py="3" onPress={deleteConversation}>
            Delete Conversation
          </Actionsheet.Item>
          <Actionsheet.Item py="3" onPress={block}>
            Block
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
});

MessageListOptions.defaultProps = {
  onToggleMute: undefined,
  onCloseOptions: undefined,
  onSelectBlock: undefined,
  onSelectDelete: undefined,
  isMuted: false,
};

export type MsgListOptionHandle = React.ElementRef<typeof MessageListOptions>;
export default MessageListOptions;
