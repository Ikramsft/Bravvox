/**
 * @format
 */
import React, {useState} from 'react';
import {useTheme, View} from 'native-base';
import {FormikProps, FormikProvider} from 'formik';
import {useQueryClient} from 'react-query';
import DatePicker from 'react-native-date-picker';
import {StyleSheet, TouchableOpacity} from 'react-native';
import moment from 'moment';
import Entypo from 'react-native-vector-icons/Entypo';
import {SubTitle, Title} from '../../../components/Typography';
import {IEventFormType} from './useEventForm';
import {HtmlEditor} from '../../../components/HtmlEditor';
import {PrivacyItem} from './PrivacyItem';
import {AvatarCoverImage, ISelectFile} from '../../../components/AvatarCoverImage';
import {IMedia} from '../../PostCreation';
import {ImageUpdateType} from '../../Profile/useUpdateAvatar';
import AutoFocusMaterialInput from '../../../components/AutoFocusMaterialInput';
import useAutoScroll from '../../../hooks/useAutoScroll';
import {updateEventImage} from './useAddEvents';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';
import {theme} from '../../../theme';
import {EventDateDisplayFormat} from '../../../utils/types';
import {isAndroid} from '../../../constants/common';

interface IEventFormProps {
  formik: FormikProps<IEventFormType>;
  eventId?: string;
  route: any;
}

const textAreaMaxLength = 1000;

function EventForm(props: IEventFormProps) {
  const {formik, eventId, route} = props;
  const {eventData} = route.params;

  const {colors} = useTheme();
  
  const queryClient = useQueryClient();

  const {captureRef, capturePos} = useAutoScroll(formik);

  const {values, errors, touched, setFieldValue, handleBlur, setFieldError} = formik;

  const [avatar, setAvatar] = useState<IMedia>(values.avatar);
  const [coverImage, setCoverImage] = useState<IMedia>(values.cover);
  const [isAvatarLoading, setAvatarLoading] = useState<boolean>(false);
  const [isCoverLoading, setCoverLoading] = useState<boolean>(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(
    eventData?.data ? moment(values.eventStartTime).format(EventDateDisplayFormat) : '',
  );
  const [endDate, setEndDate] = useState(
    eventData?.data
      ? values.eventEndTime
        ? moment(values.eventEndTime).format(EventDateDisplayFormat)
        : ''
      : '',
  );
  const [date, setDate] = React.useState(
    eventData?.data ? new Date(eventData?.data.eventStartTime) : new Date(),
  );
  const [edate, setEDate] = React.useState(
    eventData?.data
      ? values.eventEndTime
        ? new Date(eventData?.data.eventEndTime)
        : new Date()
      : new Date(),
  );

  const defaultValue: IMedia = {uri: '', name: '', type: ''};

  const togglePrivacy = (key: keyof IEventFormType) => () => {
    const currentValue = values[key];
    setFieldValue(key, !currentValue);
  };

  const selectFile = (payload: ISelectFile, type: ImageUpdateType) => {
    if (type === 'cover') {
      const imageData = {
        uri: payload.croppedFile,
        name: payload.originalFile.name,
        type: payload.originalFile.type,
      };
      setCoverImage(imageData);
      if (eventData?.data) {
        updateProfilePhoto(payload, eventData?.data?.id, 'picture');
      } else {
        setFieldValue('cover', imageData);
        setFieldValue('cropCoverData', payload);
      }
    }
    if (type === 'avatar') {
      console.log("Payload--->", JSON.stringify(payload));
      const imageData = {
        uri: payload.croppedFile,
        name: payload.originalFile.name,
        type: payload.originalFile.type,
      };
      setAvatar(imageData);
      if (eventData?.data) {
        updateProfilePhoto(payload, eventData?.data?.id, 'avatar');
      } else {
        setFieldValue('avatar', imageData);
        setFieldValue('cropData', payload);
      }
    }
  };

  const updateProfilePhoto = async (payload: ISelectFile, id: string, type: string) => {
    if (type === 'avatar') {
      setAvatarLoading(true);
    } else {
      setCoverLoading(true);
    }
    try {
      const response = await updateEventImage(payload, id, type);
      if (response.status === 200) {
        if (type === 'avatar') {
          const message = 'Event Profile Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        } else {
          const message = 'Event Cover Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        }
        queryClient.invalidateQueries([QueryKeys.eventList, type]);
        const detailCacheKey = [QueryKeys.eventProfileDetails, eventId];
        queryClient.invalidateQueries(detailCacheKey);
        const memberCacheKey = [QueryKeys.eventMembers, eventId];
        queryClient.invalidateQueries(memberCacheKey);
      }
      if (type === 'avatar') {
        setAvatarLoading(false);
      } else {
        setCoverLoading(false);
      }
    } catch (e) {
      if (type === 'avatar') {
        setAvatarLoading(false);
      } else {
        setCoverLoading(false);
      }
    }
  };

  const onDetailsChange = ({data: html, text}: {data: string; text: string}) => {
    setFieldValue('details', html);
    if (text.length > textAreaMaxLength) {
      const error = `Event Details section must be a maximum of ${textAreaMaxLength} characters.`;
      setFieldError('details', error);
    } else {
      setFieldError('details', undefined);
    }
  };

  const avatarCancelPress = () => {
    setFieldValue('avatar', '');
    setAvatar(defaultValue);
  };
  const coverCancelPress = () => {
    setFieldValue('coverImage', '');
    setCoverImage(defaultValue);
  };
  const clearDate = () => {
    setStartDate('');
    setFieldValue('eventStartTime', '');
  };
  const clearEndDate = () => {
    setEndDate('');
    setFieldValue('eventEndTime', '');
  };

  return (
    <FormikProvider value={formik}>
      <AvatarCoverImage
        avatarViewAttribute={eventData?.data?.avatarViewAttribute}
        coverViewAttribute={ eventData?.data?.pictureViewAttribute}
        isEdit={!!eventId}
        isLoadingAvatar={isAvatarLoading}
        isLoadingCover={isCoverLoading}
        originalAvatar={ eventData?.data?.avatarURL}
        originalCover={ eventData?.data?.pictureURL}
        selectFile={selectFile}
        uriAvatar={avatar ? avatar.uri : '' || eventData?.data.avatar}
        uriCover={coverImage ? coverImage.uri : '' || eventData?.data.cover}
        onAvatarCancelPress={avatarCancelPress}
        onCoverCancelPress={coverCancelPress}
      />
      <View mt={isAndroid ? 4 : 9} px={6}>
        <AutoFocusMaterialInput
          isMandatory
          error={(errors && touched.title && errors.title) || ''}
          label="Event Title"
          maxLength={100}
          name="title"
          ref={captureRef('title')}
          onBlur={handleBlur('title')}
          onPosition={capturePos('title')}
        />
        <AutoFocusMaterialInput
          label="Event Subtitle"
          maxLength={100}
          name="subtitle"
          ref={captureRef('subtitle')}
          onPosition={capturePos('subtitle')}
        />
        <View mt={5}>
          <HtmlEditor
            error={errors.details}
            placeholder="Event Details"
            value={values.details}
            onChange={onDetailsChange}
          />
        </View>
        <TouchableOpacity style={styles.container} onPress={() => setOpen(true)}>
          <View alignItems="center" flexDirection="row" justifyContent="space-between">
            <View>
              <View style={styles.subTextView}>
                <SubTitle fontSize="sm" mt={5}>
                  Event Start Date Time
                </SubTitle>
                <SubTitle fontSize="sm" ml={1} mt={5} style={{color: colors.red['900']}}>
                  *
                </SubTitle>
              </View>
              <SubTitle color={theme.colors.black[600]} fontSize={13}>
                {startDate?.toString()}
              </SubTitle>
              <DatePicker
                modal
                date={date}
                minimumDate={new Date()}
                open={open}
                onCancel={() => {
                  setOpen(false);
                }}
                onConfirm={newDate => {
                  setOpen(false);
                  setDate(newDate);
                  const startDateValue = new Date(newDate).toISOString();
                  setFieldValue('eventStartTime', startDateValue);
                  setStartDate(moment(newDate).format(EventDateDisplayFormat));
                }}
                onDateChange={newDate => {
                  setDate(newDate);
                }}
              />
            </View>
            {startDate ? (
              <TouchableOpacity onPress={clearDate}>
                <Entypo color={theme.colors.gray[500]} name="cross" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.container} onPress={() => setOpenEnd(true)}>
          <View alignItems="center" flexDirection="row" justifyContent="space-between">
            <View>
              <SubTitle fontSize="sm" mt={5}>
                Event End Date Time
              </SubTitle>
              <SubTitle color={theme.colors.black[600]} fontSize={13}>
                {endDate?.toString()}
              </SubTitle>
              <DatePicker
                modal
                date={edate}
                minimumDate={new Date(date.getTime() + 1 * 60000) || new Date()}
                open={openEnd}
                onCancel={() => {
                  setOpenEnd(false);
                }}
                onConfirm={newDate => {
                  setOpenEnd(false);
                  setEDate(newDate);
                  const endDateValue = new Date(newDate).toISOString();
                  setFieldValue('eventEndTime', endDateValue);
                  setEndDate(moment(newDate).format(EventDateDisplayFormat));
                }}
                onDateChange={newDate => {
                  setEDate(newDate);
                }}
              />
            </View>

            {endDate ? (
              <TouchableOpacity onPress={clearEndDate}>
                <Entypo color={theme.colors.gray[500]} name="cross" size={20} />
              </TouchableOpacity>
            ) : null}
          </View>
        </TouchableOpacity>

        <AutoFocusMaterialInput
          isMandatory
          error={(errors && touched.location && errors.location) || ''}
          label="Location"
          name="location"
          ref={captureRef('location')}
          onBlur={handleBlur('location')}
          onPosition={capturePos('location')}
        />

        <Title fontSize="lg" mt={5}>
          Event Privacy
        </Title>
        <PrivacyItem
          title="Posting is Open"
          value={values.isPostingOpen}
          onToggle={togglePrivacy('isPostingOpen')}
        />
        <PrivacyItem
          title="is Public"
          value={values.isPublic}
          onToggle={togglePrivacy('isPublic')}
        />
        <PrivacyItem
          title="Moderated"
          value={values.isModerated}
          onToggle={togglePrivacy('isModerated')}
        />
        <PrivacyItem
          title="Need Attendee Approval"
          value={values.requireAttendeeApproval}
          onToggle={togglePrivacy('requireAttendeeApproval')}
        />
      </View>
    </FormikProvider>
  );
}

EventForm.defaultProps = {
  eventId: '',
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: theme.colors.black[200],
    borderBottomWidth: 0.5,
  },
  subTextView: {
    flexDirection: 'row',
  },
});
export default EventForm;
