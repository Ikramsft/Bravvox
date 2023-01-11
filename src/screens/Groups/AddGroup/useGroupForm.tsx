/**
 * @format
 */
import * as Yup from 'yup';
import {FormikHelpers, useFormik} from 'formik';
import {PHONE_REGEX, URL_REGEX} from '../../../constants/common';
import {IMedia} from '../../PostCreation';
import {PicCroppedDetails} from '../../../redux/reducers/user/UserInterface';

export interface IGroupFormType {
  name: string;
  handle: string;
  validHandle: boolean;
  tagline?: string;
  about?: string;
  guidelines?: string;
  webUrl?: string;
  email?: string;
  phone?: string;
  postingIsPublic: boolean;
  isPrivate: boolean;
  isModerated: boolean;
  requireMemberApproval: boolean;
  avatar: IMedia;
  cover: IMedia;
  cropData: PicCroppedDetails;
  cropCoverData: PicCroppedDetails;
}

const defaultValues: IGroupFormType = {
  name: '',
  handle: '',
  validHandle: true,
  tagline: '',
  about: '',
  guidelines: '',
  postingIsPublic: true,
  isPrivate: false,
  isModerated: false,
  requireMemberApproval: false,
  avatar: {uri: '', name: '', type: '', height: 0, width: 0},
  cover: {uri: '', name: '', type: '', height: 0, width: 0},
  cropData: {} as PicCroppedDetails,
  cropCoverData: {} as PicCroppedDetails,
};

const schema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Group Name must be at least 4 characters')
    .required('Group Name is required field'),
  handle: Yup.string()
    .min(4, 'Group Handle must be at least 4 characters')
    .required('Group Handle is required field')
    .matches(/^[a-zA-Z][a-zA-Z0-9_\\-]+$/, 'Group Handle invalid format')
    .test(
      'handle-check',
      'Group Handle already in use, please select another.',
      // eslint-disable-next-line func-names
      function () {
        return this.parent.validHandle;
      },
    ),
  email: Yup.string().email('Email address must be a valid email format').optional().nullable(),
  webUrl: Yup.string().matches(URL_REGEX, 'Website must be a valid URL').optional().nullable(),
  phone: Yup.string()
    .matches(PHONE_REGEX, 'Phone must be a valid phone number format')
    .optional()
    .nullable(),
});

export const useGroupForm = (
  onSubmit: (
    values: IGroupFormType,
    formikHelpers: FormikHelpers<IGroupFormType>,
  ) => void | Promise<unknown>,
  initialValues: IGroupFormType = defaultValues,
) => {
  return useFormik<IGroupFormType>({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit,
  });
};
