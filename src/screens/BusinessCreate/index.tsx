/**
 * @format
 */
import React from 'react';
import {Button, useTheme, View, Text} from 'native-base';
import {StyleProp, ViewStyle, TouchableOpacity, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../navigation';
import HeaderLeft from '../../components/HeaderLeft';
import {getFormData} from '../../utils';
import {IBusinessFormType, useBusinessForm} from './useBusinessForm';
import BusinessForm from './BusinessForm';
import {useAddBusiness, useUpdateBusiness} from './useAddBusiness';
import {INewBusinessData} from '../BusinessProfile/types/BusinessInterfaces';
import {isAndroid} from '../../constants/common';
import HeaderTitle from '../../components/HeaderTitle';

type Props = NativeStackScreenProps<RootStackParamList, 'BusinessCreate'>;

const containerStyle: StyleProp<ViewStyle> = {paddingBottom: 50};

function BusinessCreate(props: Props) {
  const {route, navigation} = props;
  const {businessData} = route.params;
  const theme = useTheme();
  const data = businessData.data as INewBusinessData;
  const {isLoading, tryAddBusiness} = useAddBusiness();

  const {isLoading: updating, tryUpdateBusiness} = useUpdateBusiness(data?.id);

  const pageTitle = businessData?.data ? 'Edit Business Page' : 'Create New Business Page';

  const defaultValues: IBusinessFormType = {
    id: data?.id,
    name: data ? data.name : '',
    tagline: data?.tagline,
    about: data?.about,
    guidelines: data?.guidelines,
    webUrl: data?.webUrl,
    address: data?.address,
    email: data?.email,
    phone: data?.phone,
    postingIsPublic: data ? data.postingIsPublic : false,
    isPrivate: data ? data.isPrivate : false,
    isModerated: data ? data.isModerated : false,
    requireFollowerApproval: data ? data.requireFollowerApproval : false,
    pictureReadURL: {uri: data?.croppedPictureReadURL, type: '', name: ''},
    avatarReadURL: {uri: data?.croppedAvatarReadURL, type: '', name: ''},
  };

  const tempCropData = {
    canvasData: {
      height: 338.02816901408454,
      left: 0,
      naturalHeight: 720,
      naturalWidth: 1278,
      top: 40.58590633768429,
      width: 600,
    },
    cropBoxData: {
      height: 150,
      left: 0,
      top: 125,
      width: 600,
    },
    data: {
      height: 319.5,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      width: 1278,
      x: 0,
      y: 179.80201950073246,
    },
    minZoom: 4,
    zoom: 4,
  };

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={pageTitle} />;

    const headerRight = () => (
      <TouchableOpacity activeOpacity={0.9} onPress={navigation.goBack}>
        <Text color={theme.colors.red[900]} style={styles.cancelTextStyle}>
          Cancel
        </Text>
      </TouchableOpacity>
    );

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: IBusinessFormType) => {
    const {avatarReadURL, pictureReadURL, ...others} = values;
    const form = getFormData({...others});
    if (!businessData?.data) {
      if (avatarReadURL?.uri) {
        form.append('avatarImage', avatarReadURL);
        form.append('croppedAvatarImage', avatarReadURL);
        form.append('avatarViewAttribute', JSON.stringify(tempCropData));
      } else {
        delete values.avatarReadURL;
      }
      if (pictureReadURL?.uri) {
        form.append('pictureImage', pictureReadURL);
        form.append('croppedPictureImage', pictureReadURL);
        form.append('pictureViewAttribute', JSON.stringify(tempCropData));
      } else {
        delete values.pictureReadURL;
      }
    } else {
      delete values.avatarReadURL;
      delete values.pictureReadURL;
    }

    if (data) {
      tryUpdateBusiness(values);
    } else {
      tryAddBusiness(form);
      console.log('BUSS', form);
    }
  };

  const formik = useBusinessForm(onSubmit, defaultValues);
  const {handleSubmit, values} = formik;

  const onCreatePress = () => handleSubmit();

  return (
    <View backgroundColor={theme.colors.white} flex={1}>
      <KeyboardAwareScrollView
        contentContainerStyle={containerStyle}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <BusinessForm formik={formik} />
        <Button
          borderRadius={20}
          height={10}
          isDisabled={values.name.trim().length < 4}
          isLoading={isLoading || updating}
          isLoadingText={businessData?.data ? 'Updating' : 'Creating'}
          mt={6}
          mx={6}
          onPress={onCreatePress}>
          {businessData?.data ? 'Update' : 'Create'}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  cancelTextStyle: {
    marginEnd: 6,
    marginTop: isAndroid ? 2 : 0,
  },
});

export default BusinessCreate;
