/**
 * @format
 */
import React from 'react';
import {Button, useTheme, View} from 'native-base';
import {StyleProp, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RootStackParamList} from '../../../navigation';
import HeaderLeft from '../../../components/HeaderLeft';
import {IGroupFormType, useGroupForm} from './useGroupForm';
import GroupForm from './GroupForm';
import {getFormData} from '../../../utils';
import {useAddGroup} from './useAddGroup';
import {KEYBOARD_EXTRA_HEIGHT, saveBase64OnCache} from '../../../constants/common';
import HeaderTitle from '../../../components/HeaderTitle';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const containerStyle: StyleProp<ViewStyle> = {paddingBottom: 50};

function AddGroup(props: Props) {
  const {navigation} = props;

  const theme = useTheme();

  const {isLoading, tryAddGroup} = useAddGroup();

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Create New Group" />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
  }, [navigation]);

  const onSubmit = async (values: IGroupFormType) => {
    const {avatar, cover, cropData, cropCoverData, ...others} = values;
    const form = getFormData({...others});
    if (avatar.uri !== '') {
      const imageAttribute = {
        data: cropData.data,
        canvasData: cropData.canvasData,
        cropBoxData: cropData.cropBoxData,
        minZoom: cropData.minZoom,
        zoom: cropData.zoom,
      };
      const avatarImage = await saveBase64OnCache(avatar.uri);
      form.append('avatarImage', avatarImage);
      form.append('croppedAvatarImage', avatarImage);
      form.append('avatarViewAttribute', JSON.stringify(imageAttribute));
    }
    if (cover.uri !== '') {
      const imageAttribute = {
        data: cropCoverData.data,
        canvasData: cropCoverData.canvasData,
        cropBoxData: cropCoverData.cropBoxData,
        minZoom: cropCoverData.minZoom,
        zoom: cropCoverData.zoom,
      };
      const pictureImage = await saveBase64OnCache(cover.uri);
      form.append('pictureImage', pictureImage);
      form.append('croppedPictureImage', pictureImage);
      form.append('pictureViewAttribute', JSON.stringify(imageAttribute));
    }
    tryAddGroup(form);
  };

  const formik = useGroupForm(onSubmit);
  const {handleSubmit, values} = formik;

  const onCreatePress = () => handleSubmit();

  return (
    <View backgroundColor={theme.colors.white} flex={1}>
      <KeyboardAwareScrollView
        contentContainerStyle={containerStyle}
        extraHeight={KEYBOARD_EXTRA_HEIGHT}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <GroupForm formik={formik} />
        <Button
          borderRadius={20}
          height={10}
          isDisabled={values.name.trim().length < 4}
          isLoading={isLoading}
          isLoadingText="Creating"
          mt={6}
          mx={6}
          onPress={onCreatePress}>
          Create
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddGroup;
