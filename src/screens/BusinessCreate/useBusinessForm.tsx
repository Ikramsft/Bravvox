/**
 * @format
 */
import * as Yup from 'yup';
import {FormikHelpers, useFormik} from 'formik';
import {PHONE_REGEX, URL_REGEX} from '../../constants/common';
import {IMedia} from '../PostCreation';

export interface IBusinessFormType {
  id?: string;
  name: string;
  tagline?: string;
  about?: string;
  guidelines?: string;
  webUrl?: string;
  address?: string;
  email?: string;
  phone?: string;
  postingIsPublic: boolean;
  isPrivate: boolean;
  isModerated: boolean;
  requireFollowerApproval: boolean;
  avatarReadURL?: IMedia;
  pictureReadURL?: IMedia;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(4, 'Business Name must be at least 4 characters')
    .required('Business Name is required field'),
  email: Yup.string().email('Email address must be a valid email format').optional().nullable(),
  webUrl: Yup.string().matches(URL_REGEX, 'Website must be a valid URL').optional().nullable(),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Phone must be a valid phone number format')
    .optional()
    .nullable(),
});

export const useBusinessForm = (
  onSubmit: (
    values: IBusinessFormType,
    formikHelpers: FormikHelpers<IBusinessFormType>,
  ) => void | Promise<unknown>,
  initialValues: IBusinessFormType,
) => {
  return useFormik<IBusinessFormType>({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit,
  });
};
