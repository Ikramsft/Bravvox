/**
 * @format
 */

import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Actionsheet, useDisclose} from 'native-base';
import {Keyboard} from 'react-native';

import ReportAbuseDialog from '../../Home/NewsFeed/ReportAbuseDialog';

interface IPickerProps {
  onSelectAbuse?: (reason: string) => void;
  onSelectDelete?: () => void;
  onCloseOptions?: () => void;
}

type IPressHandler = {
  showOptions: (canReport: boolean) => void;
};

const MessageOptions = forwardRef<IPressHandler, IPickerProps>((props: IPickerProps, ref) => {
  useImperativeHandle(ref, () => ({showOptions}));

  const [report, setReport] = React.useState(false);

  const showOptions = (canReport: boolean) => {
    setReport(canReport);
    Keyboard.dismiss();
    onOpen();
  };

  const {isOpen, onOpen, onClose} = useDisclose();

  const {isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose} = useDisclose();

  const {onSelectAbuse, onSelectDelete, onCloseOptions} = props;

  const deleteMessage = () => {
    onClose();
    if (onSelectDelete) {
      onSelectDelete();
    }
  };

  const reportMessage = () => {
    onClose();
    onReportOpen();
  };

  const onSheetClose = () => {
    onClose();
    if (onCloseOptions) {
      onCloseOptions();
    }
  };

  const handleReportClose = () => {
    onClose();
    onReportClose();
    if (onCloseOptions) {
      onCloseOptions();
    }
  };

  const handleReportAbuse = async (reason: string) => {
    onReportClose();
    if (onSelectAbuse) {
      onSelectAbuse(reason);
    }
  };

  return (
    <View height={0} ref={ref} width={0}>
      <Actionsheet isOpen={isOpen} onClose={onSheetClose}>
        <Actionsheet.Content>
          <Actionsheet.Item py="3" onPress={deleteMessage}>
            Delete Message
          </Actionsheet.Item>
          {report && (
            <Actionsheet.Item py="3" onPress={reportMessage}>
              Report Message
            </Actionsheet.Item>
          )}
        </Actionsheet.Content>
      </Actionsheet>
      <ReportAbuseDialog
        handleClose={handleReportClose}
        handleSubmit={handleReportAbuse}
        open={isReportOpen}
      />
    </View>
  );
});

MessageOptions.defaultProps = {
  onSelectAbuse: undefined,
  onSelectDelete: undefined,
  onCloseOptions: undefined,
};

export type MsgOptionHandle = React.ElementRef<typeof MessageOptions>;
export default MessageOptions;
