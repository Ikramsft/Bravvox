/**
 * @format
 */
import * as Yup from 'yup';
import {FormikHelpers, useFormik} from 'formik';
import {IMedia} from '../../PostCreation';

export interface IEventFormType {
  id: string;
  title: string;
  subtitle?: string;
  details?: string;
  eventStartTime?: any;
  eventEndTime?: any;
  location: string;
  isPostingOpen: boolean;
  isPublic: boolean;
  isModerated: boolean;
  requireAttendeeApproval: boolean;
  avatar: IMedia;
  cover: IMedia;
  cropData: any;
  cropCoverData: any;
  avatarReadURL?: IMedia;
  pictureReadURL?: IMedia;
}

const defaultValues: IEventFormType = {
  id: '',
  title: '',
  subtitle: '',
  details: '',
  eventStartTime: '',
  eventEndTime: '',
  isPostingOpen: true,
  isPublic: true,
  isModerated: false,
  location: '',
  requireAttendeeApproval: false,
  avatar: {uri: '', name: '', type: ''},
  cover: {uri: '', name: '', type: ''},
  cropData: {
    croppedFile: '',
    data: '',
    canvasData: '',
    cropBoxData: '',
    originalFile: {uri: '', type: '', name: ''},
    zoom: '',
    minZoom: '',
  },
  cropCoverData: {
    croppedFile: '',
    data: '',
    canvasData: '',
    cropBoxData: '',
    originalFile: {uri: '', type: '', name: ''},
    zoom: '',
    minZoom: '',
  },
};

const schema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(4, 'Event Title must be at least 4 characters')
    .required('Event Title is required field'),
  subtitle: Yup.string().trim().min(4, 'Event Subtitle must be at least 4 characters'),
  location: Yup.string().trim().required('Location is required field'),
});

export const useEventForm = (
  onSubmit: (
    values: IEventFormType,
    formikHelpers: FormikHelpers<IEventFormType>,
  ) => void | Promise<unknown>,
  initialValues: IEventFormType = defaultValues,
) => {
  return useFormik<IEventFormType>({
    initialValues,
    enableReinitialize: true,
    validationSchema: schema,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit,
  });
};
