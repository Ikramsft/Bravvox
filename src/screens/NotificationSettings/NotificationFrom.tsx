import {theme, Divider} from 'native-base';
import React from 'react';
import {FormikProps, FormikProvider} from 'formik';
import {Title} from '../../components/Typography';
import {PrivacyItem} from '../Groups/AddGroup/PrivacyItem';
import {INotificationFormType} from './useNotificationForm';

interface INotificationProps {
  formik: FormikProps<INotificationFormType>;
}
function NotificationForm(props: INotificationProps) {
  const {formik} = props;

  const {values, setFieldValue} = formik;

  const toggleNotification = (key: keyof INotificationFormType) => () => {
    const currentValue = values[key];
    setFieldValue(key, !currentValue);
  };

  return (
    <FormikProvider value={formik}>
      {/* <Title fontFamily="heading" fontSize="xl" mt={5}>
        Mute All
      </Title>
      <PrivacyItem
        title="Mute all notifications"
        value={values.toggleMuteAll}
        onToggle={toggleNotification('toggleMuteAll')}
      />
      <Divider mb={0} my={3} /> */}

      <Title fontFamily="heading" fontSize="xl">
        Notifications You Receive
      </Title>
      <Divider mb={0} my={3} />
      <PrivacyItem
        color={theme.colors.black[900]}
        fontWeight="extrabold"
        title="Relationships"
        titleSize="lg"
        value={values.toggleRelationships}
        onToggle={toggleNotification('toggleRelationships')}
      />

      <PrivacyItem
        title="Receive Follow Request"
        value={values.toggleFollowRequest}
        onToggle={toggleNotification('toggleFollowRequest')}
      />

      <PrivacyItem
        color={theme.colors.black[900]}
        fontWeight="extrabold"
        title="Newsfeed"
        titleSize="lg"
        value={values.toggleNewsFeed}
        onToggle={toggleNotification('toggleNewsFeed')}
      />

      <PrivacyItem
        title="Reactions to your Posts"
        value={values.toggleReactions}
        onToggle={toggleNotification('toggleReactions')}
      />
      <PrivacyItem
        title="Revoxes to your Posts"
        value={values.toggleRevoxes}
        onToggle={toggleNotification('toggleRevoxes')}
      />
      <PrivacyItem
        title="People I am following Posts"
        value={values.toggleFollowingPost}
        onToggle={toggleNotification('toggleFollowingPost')}
      />
      <PrivacyItem
        title="Posts I have commented on"
        value={values.toggleCommetedPost}
        onToggle={toggleNotification('toggleCommetedPost')}
      />
    </FormikProvider>
  );
}

export default NotificationForm;
