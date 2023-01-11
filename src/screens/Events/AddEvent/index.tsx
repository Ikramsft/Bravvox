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
import {IEventFormType, useEventForm} from './useEventForm';
import EventForm from './EventForm';
import {getFormData} from '../../../utils';
import {useAddEvent, useUpdateEvent} from './useAddEvents';
import {INewEventData} from '../types/EventInterfaces';
import {KEYBOARD_EXTRA_HEIGHT, saveBase64OnCache} from '../../../constants/common';
import HeaderTitle from '../../../components/HeaderTitle';

type Props = NativeStackScreenProps<RootStackParamList, 'AddEvent'>;

const containerStyle: StyleProp<ViewStyle> = {paddingBottom: 50};

function AddEvent(props: Props) {
  const {route, navigation} = props;
  const theme = useTheme();
  const {isLoading, tryAddEvent} = useAddEvent();
  const {eventData} = route.params;
  const data = eventData.data as INewEventData;
  const {isLoading: updating, tryUpdateEvent} = useUpdateEvent(data?.id);
  const pageTitle = eventData?.data ? 'Edit Event Page' : 'Create New Event Page';

  const defaultValues: IEventFormType = {
    id: data?.id,
    title: data ? data?.title : '',
    subtitle: data ? data?.subtitle : '',
    details: data ? data?.details : '',
    eventStartTime: data?.eventStartTime,
    eventEndTime: data?.eventEndTime,
    location: data ? data?.location : '',
    isPostingOpen: data ? data.isPostingOpen : true,
    isPublic: data ? data.isPublic : true,
    isModerated: data ? data.isModerated : false,
    requireAttendeeApproval: data ? data.requireAttendeeApproval : false,
    cover: {uri: data?.croppedPictureURL, type: '', name: ''},
    avatar: {uri: data?.croppedAvatarURL, type: '', name: ''},
    cropData: {
      croppedFile: '',
      data: '',
      canvasData: '',
      cropBoxData: '',
      originalFile: {uri: '', type: '', name: '', base64: ''},
      zoom: '',
      minZoom: '',
    },
    cropCoverData: {
      croppedFile: '',
      data: '',
      canvasData: '',
      cropBoxData: '',
      originalFile: {uri: '', type: '', name: '', base64: ''},
      zoom: '',
      minZoom: '',
    },
  };

  React.useLayoutEffect(() => {
    const headerLeft = () => <HeaderLeft onPress={navigation.goBack} />;
    const headerTitle = () => <HeaderTitle title={pageTitle} />;

    navigation.setOptions({
      headerShown: true,
      headerTitleAlign: 'center',
      headerBackVisible: false,
      headerTitle,
      headerLeft,
      headerRight: () => null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (values: IEventFormType) => {
    const {avatar, cover, cropData, cropCoverData, ...others} = values;
    const form = getFormData({...others});

    if (!eventData?.data) {
      if (avatar?.uri) {
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
      } else {
        delete values.avatarReadURL;
      }
      if (cover?.uri) {
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
      } else {
        delete values.pictureReadURL;
      }
    } else {
      delete values.avatarReadURL;
      delete values.pictureReadURL;
    }

    if (data) {
      tryUpdateEvent(values);
    } else {
      tryAddEvent(form);
    }
  };


  const formik = useEventForm(onSubmit, defaultValues);
  const {handleSubmit, values} = formik;
  const onCreatePress = () => handleSubmit();

  return (
    <View backgroundColor={theme.colors.white} flex={1}>
      <KeyboardAwareScrollView
        contentContainerStyle={containerStyle}
        extraHeight={KEYBOARD_EXTRA_HEIGHT}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <EventForm formik={formik} {...props} eventId={eventData.data?.id} />
        <Button
          borderRadius={20}
          height={10}
          isDisabled={
            values.title.trim().length < 4 || values.eventStartTime === '' || values.location === ''
          }
          isLoading={isLoading || updating}
          isLoadingText={eventData?.data ? 'Updating' : 'Creating'}
          mt={6}
          mx={6}
          onPress={onCreatePress}>
          {eventData?.data ? 'Update' : 'Create'}
        </Button>
      </KeyboardAwareScrollView>
    </View>
  );
}

export default AddEvent;
