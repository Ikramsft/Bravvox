/**
 * @format
 */
import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Actionsheet, useDisclose, Box, Text} from 'native-base';

export type IAssetType = string;
interface ISocialPikerProps {
  onSelectSocial: (data: string) => void;
}

type IPressHandler = {
  onPickerSelect: (type?: string) => void;
};

const SocialMediaPiker = forwardRef<IPressHandler, ISocialPikerProps>(
  (props: ISocialPikerProps, ref) => {
    useImperativeHandle(ref, () => ({onPickerSelect: onOpen}));

    const {isOpen, onOpen, onClose} = useDisclose();

    const {onSelectSocial} = props;

    const selectTwitter = () => {
      onClose();
      onSelectSocial('twitterAccount');
    };

    const selectFacebook = () => {
      onClose();
      onSelectSocial('facebookAccount');
    };

    return (
      <View height={0} ref={ref} width={0}>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
          <Actionsheet.Content>
            <Box justifyContent="center" px={4} py="3" w="100%">
              <Text color="black.900" fontFamily="heading" fontSize="20">
                Please select social type:
              </Text>
            </Box>
            <Actionsheet.Item py="3" onPress={selectTwitter}>
              Twitter
            </Actionsheet.Item>
            <Actionsheet.Item py="3" onPress={selectFacebook}>
              Facebook
            </Actionsheet.Item>
          </Actionsheet.Content>
        </Actionsheet>
      </View>
    );
  },
);

export type SocialPickerHandle = React.ElementRef<typeof SocialMediaPiker>;
export default SocialMediaPiker;
