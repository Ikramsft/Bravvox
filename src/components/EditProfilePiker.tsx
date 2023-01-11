/**
 * @format
 */
import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Actionsheet, useDisclose} from 'native-base';

export type IAssetType = string;
interface IEditProfileProps {
  onSelectOption: (data: string) => void;
}

type IPressHandler = {
  onPickerSelect: (type?: string) => void;
};

const EditProfilePiker = forwardRef<IPressHandler, IEditProfileProps>(
  (props: IEditProfileProps, ref) => {
    useImperativeHandle(ref, () => ({onPickerSelect: onOpen}));

    const {isOpen, onOpen, onClose} = useDisclose();

    const {onSelectOption} = props;

    const selectEdit = () => {
      onClose();
      onSelectOption('Edit');
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Actionsheet.Item py="3" onPress={selectEdit}>
              Edit Profile
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  },
);

export type EditProfileHandle = React.ElementRef<typeof EditProfilePiker>;
export default EditProfilePiker;
