/**
 * @format
 */
import * as Yup from 'yup';
import {FormikHelpers, useFormik} from 'formik';
import {PASS_REGEX} from '../../constants/common';

export interface IPasswordType {
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
}

const defaultValues: IPasswordType = {
  oldpassword: '',
  newpassword: '',
  confirmpassword: '',
};

const schema = Yup.object().shape({
  oldpassword: Yup.string()
    .required('Please enter password')
    .matches(
      PASS_REGEX,
      'Password must be between 8-40 characters, it must contain 1 upper case, 1 lower case, 1 number and 1 special character.',
    ),
  newpassword: Yup.string()
    .required('Please enter new password')
    .matches(
      PASS_REGEX,
      'Password must be between 8-40 characters, it must contain 1 upper case, 1 lower case, 1 number and 1 special character.',
    )
    .notOneOf(
      [Yup.ref('oldpassword'), null],
      'New password cannot be the same as the old password.',
    ),
  confirmpassword: Yup.string()
    .required('Please enter confirm password')
    .oneOf([Yup.ref('newpassword'), null], 'New Password and Confirm Password should match'),
});

export const useUpdatePasswordForm = (
  onSubmit: (
    values: IPasswordType,
    formikHelpers: FormikHelpers<IPasswordType>,
  ) => void | Promise<any>,
  initialValues: IPasswordType = defaultValues,
) => {
  return useFormik<IPasswordType>({
    initialValues,
    enableReinitialize: false,
    validationSchema: schema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit,
  });
};
