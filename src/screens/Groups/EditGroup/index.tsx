/**
 * @format
 */
import React from 'react';
import {Button, useTheme, View} from 'native-base';
import {StyleProp, ViewStyle} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {isEqual} from 'lodash';

import {RootStackParamList} from '../../../navigation';
import HeaderLeft from '../../../components/HeaderLeft';
import {IGroupFormType, useGroupForm} from '../AddGroup/useGroupForm';
import GroupForm from '../AddGroup/GroupForm';
import {useUpdateGroup} from './useUpdateGroup';
import HeaderTitle from '../../../components/HeaderTitle';
import {KEYBOARD_EXTRA_HEIGHT} from '../../../constants/common';

type Props = NativeStackScreenProps<RootStackParamList, 'EditGroup'>;

const containerStyle: StyleProp<ViewStyle> = {paddingBottom: 50};

function EditGroup(props: Props) {
  const {navigation, route} = props;
  const {groupId, groupInfo} = route.params;
  const theme = useTheme();

  const {isLoading, tryUpdateGroup} = useUpdateGroup(groupId);

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title="Edit Group" />;

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
    const {avatar: avatarImage, cover: pictureImage, ...others} = values;
    tryUpdateGroup({...others, avatarImage, pictureImage});
  };

  const formik = useGroupForm(onSubmit, {...groupInfo, validHandle: true});
  const {handleSubmit, values} = formik;

  const onCreatePress = () => handleSubmit();

  const isDisabled = values.name.trim().length < 4 || isEqual(groupInfo, values);

  return (
    <View backgroundColor={theme.colors.white} flex={1}>
      <KeyboardAwareScrollView
        contentContainerStyle={containerStyle}
        extraHeight={KEYBOARD_EXTRA_HEIGHT}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <GroupForm formik={formik} groupId={groupId} initialHandle={groupInfo.handle} />
        <Button
          borderRadius={20}
          height={10}
          isDisabled={isDisabled}
          isLoading={isLoading}
          isLoadingText="Updating"
          mt={6}
          mx={6}
          onPress={onCreatePress}>
          Update
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default EditGroup;
