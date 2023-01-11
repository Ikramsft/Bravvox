/**
 * @format
 */
import React from 'react';
import {View} from 'native-base';
import {FormikProps, FormikProvider} from 'formik';
import {useQueryClient} from 'react-query';
import {Title} from '../../components/Typography';
import {HtmlEditor} from '../../components/HtmlEditor';
import {IMedia} from '../PostCreation';
import {ImageUpdateType} from '../Profile/useUpdateAvatar';
import {formatPhoneNumber} from '../../constants/common';
import {AvatarCoverImage} from '../../components/AvatarCoverImage';
import {PrivacyItem} from '../Groups/AddGroup/PrivacyItem';
import {IBusinessFormType} from './useBusinessForm';
import {updateBusinessImage} from './useAddBusiness';
import {QueryKeys} from '../../utils/QueryKeys';
import {showSnackbar} from '../../utils/SnackBar';
import {businessResponse} from '../BusinessProfile/types/BusinessInterfaces';
import useAutoScroll from '../../hooks/useAutoScroll';
import AutoFocusMaterialInput from '../../components/AutoFocusMaterialInput';

interface IBusinessFormProps {
  formik: FormikProps<IBusinessFormType>;
}

const textAreaMaxLength = 1000;

function GroupForm(props: IBusinessFormProps) {
  const {formik} = props;
  const queryClient = useQueryClient();
  const [isAvatarLoading, setAvatarLoading] = React.useState<boolean>(false);
  const [isCoverLoading, setCoverLoading] = React.useState<boolean>(false);

  const {captureRef, capturePos} = useAutoScroll(formik);
  const {values, errors, setFieldValue, setFieldError} = formik;

  const coverImage: string = values?.pictureReadURL?.uri || '';
  const profileImage: string = values?.avatarReadURL?.uri || '';

  const togglePrivacy = (key: keyof IBusinessFormType) => () => {
    const currentValue = values[key];
    setFieldValue(key, !currentValue);
  };

  const selectFile = (media: IMedia, type: ImageUpdateType) => {
    if (!values.id) {
      if (type === 'avatar') {
        setFieldValue('avatarReadURL', media);
      } else {
        setFieldValue('pictureReadURL', media);
      }
    } else {
      uploadImage(media, type);
    }
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

  const uploadImage = async (media: IMedia, type: ImageUpdateType) => {
    try {
      if (type === 'avatar') {
        setAvatarLoading(true);
      } else {
        setCoverLoading(true);
      }
      const formData = new FormData();
      formData.append('image', media);
      formData.append('croppedImage', media);
      formData.append('imageViewAttribute', JSON.stringify(tempCropData));
      formData.append('businessPageImageType', type === 'avatar' ? type : 'picture');
      const response: businessResponse = await updateBusinessImage(formData, values.id);
      if (response.code === 200) {
        queryClient.invalidateQueries([QueryKeys.businessDetails]);
        queryClient.invalidateQueries([QueryKeys.businessList]);
        if (type === 'avatar') {
          setFieldValue('avatarReadURL', media);
          const message = 'Business Profile Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        } else {
          setFieldValue('pictureReadURL', media);
          const message = 'Business Cover Image uploaded successfully';
          showSnackbar({message, type: 'success'});
        }
      }
      setAvatarLoading(false);
      setCoverLoading(false);
    } catch (error) {
      setAvatarLoading(false);
      setCoverLoading(false);
    }
  };

  const onAboutChange = ({data: html, text}: {data: string; text: string}) => {
    setFieldValue('about', html);
    if (text.length > textAreaMaxLength) {
      const error = `Business About section must be a maximum of ${textAreaMaxLength} characters.`;
      setFieldError('about', error);
    } else {
      setFieldError('about', undefined);
    }
  };

  const onGuidelineChange = ({data: html, text}: {data: string; text: string}) => {
    setFieldValue('guidelines', html);
    if (text.length > textAreaMaxLength) {
      const error = `Business Guidelines section must be a maximum of ${textAreaMaxLength} characters.`;
      setFieldError('guidelines', error);
    } else {
      setFieldError('guidelines', undefined);
    }
  };

  return (
    <FormikProvider value={formik}>
      <AvatarCoverImage
        isLoadingAvatar={isAvatarLoading}
        isLoadingCover={isCoverLoading}
        selectFile={selectFile}
        uriAvatar={profileImage}
        uriCover={coverImage}
      />
      <View px={6}>
        <AutoFocusMaterialInput
          label="Business page Name *"
          maxLength={100}
          name="name"
          ref={captureRef('name')}
          onPosition={capturePos('name')}
        />
        <AutoFocusMaterialInput
          label="Tagline"
          maxLength={60}
          name="tagline"
          ref={captureRef('tagline')}
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
          label="Address"
          name="address"
          ref={captureRef('address')}
          onPosition={capturePos('address')}
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
          Business page Privacy
        </Title>
        <PrivacyItem
          title="Posting is Public"
          value={values.postingIsPublic}
          onToggle={togglePrivacy('postingIsPublic')}
        />
        <PrivacyItem
          title="Page is Private"
          value={values.isPrivate}
          onToggle={togglePrivacy('isPrivate')}
        />
        <PrivacyItem
          title="Moderated"
          value={values.isModerated}
          onToggle={togglePrivacy('isModerated')}
        />
        <PrivacyItem
          title="Need Follower Approval"
          value={values.requireFollowerApproval}
          onToggle={togglePrivacy('requireFollowerApproval')}
        />
      </View>
    </FormikProvider>
  );
}

export default GroupForm;
