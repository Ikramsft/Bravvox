import React, {useState, useRef} from 'react';
import {StyleSheet, TouchableOpacity, TextInput, Linking, Keyboard, Platform} from 'react-native';
import {Button, View, Text} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FormikProps} from 'formik';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {RootStackParamList} from '../../navigation';
import {theme} from '../../theme';
import useUserInfo from '../../hooks/useUserInfo';
import SocialMediaPiker, {SocialPickerHandle} from '../../components/SocialMediaPiker';
import MaterialInput from '../../components/MaterialInput';
import DropDownInput from '../../components/DropDownInput';
import {SocialItem} from './SocialItem';
import {isAndroid} from '../../constants/common';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

interface MyFormValues {
  name: string;
  profileTagline: string;
  bio: string;
  website: string;
  location: string;
  facebookAccount: string;
  twitterAccount: string;
}
interface formProps extends Props {
  formikProps: FormikProps<MyFormValues>;
  isFormSubmitting: boolean;
}

type PlatformType = 'twitterAccount' | 'facebookAccount' | '';

interface ISocialLinks {
  platform: PlatformType;
  username: string;
  forEdit: boolean;
  editingPlatform: PlatformType;
}

export function EditProfileForm(props: formProps) {
  const {user} = useUserInfo();

  const {formikProps, isFormSubmitting} = props;
  const {values, errors, setFieldError, setFieldValue, handleChange, handleSubmit} = formikProps;

  const errName = !errors.name;
  const errWeb = !errors.website;

  const [showSocialLinksForm, setShowSocialLinksForm] = useState<boolean>(false);
  const [isSocialLinksValid, setIsSocialLinksValid] = useState<string>('');
  const [initialTextLoc, setInitialTextLoc] = React.useState<any>(1);
  const [editSocialLinksFields, setEditSocialLinksFields] = useState<ISocialLinks>({
    platform: 'twitterAccount',
    username: '',
    forEdit: false,
    editingPlatform: '',
  });

  const tagLineRef = useRef<TextInput>(null);
  const aboutRef = useRef<TextInput>(null);
  const websiteRef = useRef<TextInput>(null);
  const locationRef = useRef<TextInput>(null);
  const socialPicker = React.useRef<SocialPickerHandle>(null);

  const isUpdate =
    values.name !== user.name ||
    values.profileTagline !== user.profileTagline ||
    values.bio !== user.bio ||
    values.website !== user.website ||
    values.location !== user.location ||
    values.facebookAccount !== user.facebookAccount ||
    values.twitterAccount !== user.twitterAccount;

  const selectSocial = () => {
    Keyboard.dismiss();
    socialPicker.current?.onPickerSelect();
  };

  const focusTagLine = () => tagLineRef.current?.focus();
  const focusAbout = () => aboutRef.current?.focus();
  const focusWebsite = () => websiteRef.current?.focus();
  const focusLocation = () => locationRef.current?.focus();

  const validateData = () => {
    let isValid = true;
    if (values.name.trim().length < 2) {
      setFieldError('name', 'Display Must Be Two Or More Letters');
      isValid = false;
    }
    return isValid;
  };

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const addSocialLink = async () => {
    if (showSocialLinksForm) {
      const {platform, forEdit, username, editingPlatform} = editSocialLinksFields;
      console.log('editSocialLinksFields->', JSON.stringify(editSocialLinksFields, null, 2));

      if (
        platform === 'facebookAccount' &&
        ((values.facebookAccount && forEdit === false) ||
          (editingPlatform !== 'facebookAccount' && values.twitterAccount && forEdit !== false))
      ) {
        console.log('condition 1');
        setEditSocialLinksFields({...editSocialLinksFields, username: '', forEdit: false});
        setIsSocialLinksValid(`Facebook account already added`);
      } else if (
        platform === 'twitterAccount' &&
        ((values.twitterAccount && forEdit === false) ||
          (editingPlatform !== 'twitterAccount' && values.facebookAccount && forEdit !== false))
      ) {
        console.log('condition 2');
        setEditSocialLinksFields({...editSocialLinksFields, username: '', forEdit: false});
        setIsSocialLinksValid(`Twitter account already added`);
      } else if (username === '' || username.length === 0) {
        console.log('condition 3');
        setIsSocialLinksValid(`Username is required`);
      } else {
        console.log('condition 4');
        setFieldValue(platform, username);
        setEditSocialLinksFields({...editSocialLinksFields, username: '', forEdit: false});
        setIsSocialLinksValid('');
      }
      setShowSocialLinksForm(false);
    } else {
      setEditSocialLinksFields({...editSocialLinksFields, username: '', forEdit: false});
      setIsSocialLinksValid('');
      setShowSocialLinksForm(!showSocialLinksForm);
    }
  };

  const displayName = values.name.trim() === '' ? '' : values.name;
  const profileTagline = values.profileTagline.trim() === '' ? '' : values.profileTagline;
  const bio = values.bio.trim() === '' ? '' : values.bio;
  const website = values.website.trim() === '' ? '' : values.website;
  const location = values.location.trim() === '' ? '' : values.location;

  const submit = () => {
    setIsSocialLinksValid('');
    if (validateData()) {
      handleSubmit();
    }
  };

  const socialAddDisable = showSocialLinksForm ? !editSocialLinksFields.username.length : false;

  return (
    <View width="100%">
      <MaterialInput
        isMandatory
        error={errors.name}
        label="Display Name"
        maxLength={100}
        value={displayName}
        onBlur={validateData}
        onChangeText={handleChange('name')}
        onSubmitEditing={focusTagLine}
      />
      <View mt={2}>
        <MaterialInput
          customHeight
          multiline
          error={errors.profileTagline}
          label="Tagline"
          maxLength={300}
          ref={tagLineRef}
          selection={isAndroid ? {start: initialTextLoc} : undefined}
          value={profileTagline}
          onChangeText={handleChange('profileTagline')}
          onFocus={() => setInitialTextLoc(undefined)}
          onSubmitEditing={focusAbout}
        />
      </View>
      <View mt={2}>
        <MaterialInput
          customHeight
          multiline
          error={errors.bio}
          label="About"
          maxLength={1000}
          ref={aboutRef}
          selection={isAndroid ? {start: initialTextLoc} : undefined}
          value={bio}
          onChangeText={handleChange('bio')}
          onFocus={() => setInitialTextLoc(undefined)}
          onSubmitEditing={focusWebsite}
        />
      </View>
      <View mt={2}>
        <MaterialInput
          lowerCaseOnly
          error={errors.website}
          label="Website"
          ref={websiteRef}
          value={website}
          onBlur={validateData}
          onChangeText={handleChange('website')}
          onSubmitEditing={focusLocation}
        />
      </View>
      <View mt={2}>
        <MaterialInput
          error={errors.location}
          label="Location"
          maxLength={300}
          ref={locationRef}
          value={location}
          onChangeText={handleChange('location')}
        />
      </View>
      {showSocialLinksForm && (
        <View>
          <DropDownInput
            containerStyle={styles.dropDownInputStyle}
            label="Select Social media type"
            value={editSocialLinksFields.platform === 'facebookAccount' ? 'Facebook' : 'Twitter'}
            onPress={selectSocial}
          />
          <MaterialInput
            lowerCaseOnly
            error={isSocialLinksValid}
            label="Username"
            maxLength={300}
            ref={locationRef}
            value={editSocialLinksFields.username}
            onChange={e =>
              setEditSocialLinksFields({...editSocialLinksFields, username: e.nativeEvent.text})
            }
          />
        </View>
      )}
      <View mt={5} style={styles.addSocialView}>
        <TouchableOpacity
          activeOpacity={0.9}
          disabled={socialAddDisable}
          style={socialAddDisable ? styles.disableAddSocialButton : styles.addSocialButton}
          onPress={addSocialLink}>
          <Text color={theme.colors.white} fontWeight={600}>
            {editSocialLinksFields.forEdit ? 'Update Social Link' : 'Add Social Link'}
          </Text>
        </TouchableOpacity>
        {showSocialLinksForm && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.cancelButton}
            onPress={() => {
              setEditSocialLinksFields({
                ...editSocialLinksFields,
                username: '',
                forEdit: false,
                editingPlatform: '',
              });
              setShowSocialLinksForm(false);
              setIsSocialLinksValid('');
            }}>
            <Text color={theme.colors.white} fontWeight={600}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View>
        {isSocialLinksValid !== '' ? (
          <Text style={styles.errorText}>{isSocialLinksValid}</Text>
        ) : null}
      </View>
      {values.facebookAccount !== null && values.facebookAccount !== '' && (
        <SocialItem
          ICON={<EvilIcons color="#000" name="sc-facebook" size={18} />}
          title={values.facebookAccount}
          url={`https://facebook.com/${values.facebookAccount}`}
          onDelete={() => setFieldValue('facebookAccount', '')}
          onEdit={() => {
            setIsSocialLinksValid('');
            setEditSocialLinksFields({
              platform: 'facebookAccount',
              username: values.facebookAccount,
              forEdit: true,
              editingPlatform: 'facebookAccount',
            });
            setShowSocialLinksForm(true);
          }}
          onLink={() => openLink(`https://facebook.com/${values.facebookAccount}`)}
        />
      )}
      {values.twitterAccount !== null && values.twitterAccount !== '' && (
        <SocialItem
          ICON={<Entypo color="#000" name="twitter" size={12} />}
          title={values.twitterAccount}
          url={`https://twitter.com/${values.twitterAccount}`}
          onDelete={() => setFieldValue('twitterAccount', '')}
          onEdit={() => {
            setIsSocialLinksValid('');
            setEditSocialLinksFields({
              platform: 'twitterAccount',
              username: values.twitterAccount,
              forEdit: true,
              editingPlatform: 'twitterAccount',
            });
            setShowSocialLinksForm(true);
          }}
          onLink={() => openLink(`https://twitter.com/${values.twitterAccount}`)}
        />
      )}
      <View>
        <Button
          _text={{color: 'white'}}
          backgroundColor="#4496f3"
          isDisabled={!isUpdate || !errName || !errWeb}
          isLoading={isFormSubmitting}
          mt="5"
          rounded="3xl"
          onPress={submit}>
          Update
        </Button>
      </View>
      <SocialMediaPiker
        ref={socialPicker}
        onSelectSocial={type =>
          setEditSocialLinksFields({...editSocialLinksFields, platform: type as PlatformType})
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addSocialView: {
    flexDirection: 'row',
  },
  addSocialButton: {
    backgroundColor: theme.colors.red[600],
    padding: 4,
    borderRadius: 4,
  },
  disableAddSocialButton: {
    backgroundColor: theme.colors.red[400],
    padding: 4,
    borderRadius: 4,
  },
  cancelButton: {
    backgroundColor: theme.colors.black[500],
    padding: 4,
    borderRadius: 4,
    marginStart: 10,
  },
  errorText: {
    color: theme.colors.red[400],
    marginTop: 6,
    fontSize: 15,
  },
  dropDownInputStyle: {
    marginTop: 20,
  },
});
