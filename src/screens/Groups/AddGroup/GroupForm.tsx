/**
 * @format
 */
import React, {useState} from 'react';
import {Spinner, View} from 'native-base';
import {FormikProps, FormikProvider} from 'formik';
import {useQueryClient} from 'react-query';
import {Title} from '../../../components/Typography';
import {IGroupFormType} from './useGroupForm';
import {HtmlEditor} from '../../../components/HtmlEditor';
import {PrivacyItem} from './PrivacyItem';
import {AvatarCoverImage, ISelectFile} from '../../../components/AvatarCoverImage';
import {IMedia} from '../../PostCreation';
import {ImageUpdateType} from '../../Profile/useUpdateAvatar';
import {formatPhoneNumber, isAndroid} from '../../../constants/common';
import AutoFocusMaterialInput from '../../../components/AutoFocusMaterialInput';
import useAutoScroll from '../../../hooks/useAutoScroll';
import {checkGroupHandleValid, updateGroupImage} from './useAddGroup';
import {showSnackbar} from '../../../utils/SnackBar';
import {QueryKeys} from '../../../utils/QueryKeys';

interface IGroupFormProps {
  formik: FormikProps<IGroupFormType>;
  groupId?: string;
  initialHandle?: string;
}

type ChangeData = {
  data: string;
  text: string;
};

const textAreaMaxLength = 1000;

function GroupForm(props: IGroupFormProps) {
  const {formik, groupId, initialHandle} = props;

  const [validatingUsername, setValidatingHandle] = useState(false);

  const queryClient = useQueryClient();
  const {captureRef, capturePos} = useAutoScroll(formik);
  const {values, errors, touched, handleBlur, setFieldValue, setFieldError, setFieldTouched} =
    formik;
  const [avatar, setAvatar] = useState<IMedia>(values.avatar);
  const [coverImage, setCoverImage] = useState<IMedia>(values.cover);
  const [isAvatarLoading, setAvatarLoading] = React.useState<boolean>(false);
  const [isCoverLoading, setCoverLoading] = React.useState<boolean>(false);
  const [initialTextLoc, setInitialTextLoc] = React.useState<any>(1);

  const defaultValue: IMedia = {uri: '', name: '', type: '', height: 0, width: 0};

  const validateHandle = async () => {
    const shouldValidate =
      values.handle !== '' && initialHandle !== values.handle && values.handle.length >= 4;
    if (shouldValidate) {
      setValidatingHandle(true);
      const isAvailable = await checkGroupHandleValid(values.handle);
      setFieldValue('validHandle', isAvailable);
      setValidatingHandle(false);
    }
  };

  React.useEffect(() => {
    if (!validatingUsername) {
      console.log('updating->');
      setFieldTouched('handle', true, true);
      handleBlur('handle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validatingUsername]);

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      validateHandle();
    }, 200);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.handle]);

  const togglePrivacy = (key: keyof IGroupFormType) => () => {
    const currentValue = values[key];
    setFieldValue(key, !currentValue);
  };

  const selectFile = (payload: ISelectFile, type: ImageUpdateType) => {
    const imageData = {
      uri: payload.croppedFile,
      name: payload.originalFile.name,
      type: payload.originalFile.type,
    };
    if (type === 'cover') {
      setCoverImage(imageData);
      if (groupId) {
        updateProfilePhoto(payload, groupId, 'picture');
      } else {
        setFieldValue('cover', imageData);
        setFieldValue('cropCoverData', payload);
      }
    }
    if (type === 'avatar') {
      setAvatar(imageData);
      if (groupId) {
        updateProfilePhoto(payload, groupId, 'avatar');
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
      const response = await updateGroupImage(payload, id, type);
      if (response.status === 200) {
        if (type === 'avatar') {
          const message = 'Group Profile Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        } else {
          const message = 'Group Cover Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        }
        queryClient.invalidateQueries([QueryKeys.groupsList, type]);
        const detailCacheKey = [QueryKeys.groupProfileDetails, id];
        queryClient.invalidateQueries(detailCacheKey);
        const memberCacheKey = [QueryKeys.groupMembers, id];
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

  const onAboutChange = ({data: html, text}: ChangeData) => {
    setFieldValue('about', html);
    if (text.length > textAreaMaxLength) {
      const error = `Group About section must be a maximum of ${textAreaMaxLength} characters.`;
      setFieldError('about', error);
    } else {
      setFieldError('about', undefined);
    }
  };

  const onGuidelineChange = ({data: html, text}: ChangeData) => {
    setFieldValue('guidelines', html);
    if (text.length > textAreaMaxLength) {
      const error = `Group Guidelines section must be a maximum of ${textAreaMaxLength} characters.`;
      setFieldError('guidelines', error);
    } else {
      setFieldError('guidelines', undefined);
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

  return (
    <FormikProvider value={formik}>
      <AvatarCoverImage
        avatarViewAttribute={values?.cropData}
        coverViewAttribute={values?.cropCoverData}
        isEdit={Boolean(groupId)}
        isLoadingAvatar={isAvatarLoading}
        isLoadingCover={isCoverLoading}
        originalAvatar={values?.avatar?.uri}
        originalCover={values?.cover?.uri}
        selectFile={selectFile}
        uriAvatar={avatar?.uri || ''}
        uriCover={coverImage?.uri || ''}
        onAvatarCancelPress={avatarCancelPress}
        onCoverCancelPress={coverCancelPress}
      />
      <View px={6}>
        <AutoFocusMaterialInput
          isMandatory
          error={(errors && touched.name && errors.name) || ''}
          label="Group Name"
          maxLength={100}
          name="name"
          ref={captureRef('name')}
          onBlur={handleBlur('name')}
          onPosition={capturePos('name')}
        />
        <AutoFocusMaterialInput
          isMandatory
          error={(errors && touched.handle && errors.handle) || ''}
          label="Group Handle"
          maxLength={100}
          name="handle"
          ref={captureRef('handle')}
          rightComponent={
            <View mr="3">
              {validatingUsername && <Spinner accessibilityLabel="Validating handle" pt={4} />}
            </View>
          }
          onBlur={handleBlur('handle')}
          onPosition={capturePos('handle')}
        />
        <AutoFocusMaterialInput
          multiline
          label="Tagline"
          maxLength={60}
          name="tagline"
          ref={captureRef('tagline')}
          selection={isAndroid ? {start: initialTextLoc} : undefined}
          onFocus={() => setInitialTextLoc(undefined)}
          onPosition={capturePos('tagline')}
        />
        <View mt={5}>
          <HtmlEditor
            error={errors.about}
            placeholder="About"
            value={values.about}
            onChange={onAboutChange}
          />
        </View>
        <View mt={5}>
          <HtmlEditor
            error={errors.guidelines}
            placeholder="Guidelines"
            value={values.guidelines}
            onChange={onGuidelineChange}
          />
        </View>
        <AutoFocusMaterialInput
          keyboardType="url"
          label="Website"
          name="webUrl"
          ref={captureRef('webUrl')}
          onPosition={capturePos('webUrl')}
        />
        <AutoFocusMaterialInput
          lowerCaseOnly
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          name="email"
          ref={captureRef('email')}
          onPosition={capturePos('email')}
        />
        <AutoFocusMaterialInput
          keyboardType="phone-pad"
          label="Phone"
          name="phone"
          ref={captureRef('phone')}
          returnKeyType="done"
          value={formatPhoneNumber(values.phone ?? '')}
          onPosition={capturePos('phone')}
        />
        <Title fontSize="lg" mt={5}>
          Group Privacy
        </Title>
        <PrivacyItem
          title="Posting is Public"
          value={values.postingIsPublic}
          onToggle={togglePrivacy('postingIsPublic')}
        />
        <PrivacyItem
          title="Group is Private"
          value={values.isPrivate}
          onToggle={togglePrivacy('isPrivate')}
        />
        <PrivacyItem
          title="Moderated"
          value={values.isModerated}
          onToggle={togglePrivacy('isModerated')}
        />
        <PrivacyItem
          title="Need Member Approval"
          value={values.requireMemberApproval}
          onToggle={togglePrivacy('requireMemberApproval')}
        />
      </View>
    </FormikProvider>
  );
}

GroupForm.defaultProps = {
  groupId: '',
  initialHandle: undefined,
};

export default GroupForm;
