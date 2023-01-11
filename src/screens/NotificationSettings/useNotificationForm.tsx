/**
 * @format
 */
import {FormikHelpers, useFormik} from 'formik';
import {useNotificationsFetch} from './Queries/useNotificationUpdate';

export interface INotificationFormType {
  toggleMuteAll: boolean;
  toggleRelationships: boolean;
  toggleFollowRequest: boolean;
  toggleNewsFeed: boolean;
  toggleReactions: boolean;
  toggleRevoxes: boolean;
  toggleFollowingPost: boolean;
  toggleCommetedPost: boolean;
}

const defaultValues: INotificationFormType = {
  toggleMuteAll: false,
  toggleRelationships: false,
  toggleFollowRequest: false,
  toggleNewsFeed: false,
  toggleReactions: false,
  toggleRevoxes: false,
  toggleFollowingPost: false,
  toggleCommetedPost: false,
};

export const useNotificationForm = (
  onSubmit: (
    values: INotificationFormType,
    formikHelpers: FormikHelpers<INotificationFormType>,
  ) => void | Promise<unknown>,
  initialValues: INotificationFormType = defaultValues,
) => {
  const {data: notificationData} = useNotificationsFetch();
  initialValues = {
    ...initialValues,
    toggleRelationships: notificationData?.data?.notificationsOn,
    toggleFollowRequest: notificationData?.data?.autoApproveFollowers,
  };
  return useFormik<INotificationFormType>({
    initialValues,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit,
  });
};
