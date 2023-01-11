/**
 * @format
 */
import React, {useRef} from 'react';
import {InteractionManager, ScrollView, TextInput} from 'react-native';
import {FormikProps, FormikErrors, FormikValues} from 'formik';
import {IGroupFormType} from '../screens/Groups/AddGroup/useGroupForm';
import {IBusinessFormType} from '../screens/BusinessCreate/useBusinessForm';
import {IEventFormType} from '../screens/Events/AddEvent/useEventForm';

export type CaptureRefType = (inputKey: string) => (ref: TextInput | null) => void;
export type CapturePosition = (inputKey: string) => (y: number) => void;
type IFormikProp =
  | FormikProps<IGroupFormType>
  | FormikProps<IBusinessFormType>
  | FormikProps<unknown>
  | FormikProps<IEventFormType>;

const findFirstErrorElement = (
  refs: {[key: string]: number},
  errors: FormikErrors<FormikValues>,
) => {
  const items = Object.entries(refs)
    .filter(([key]) => Object.keys(errors).includes(key))
    .sort(([, v1], [, v2]) => v1 - v2);
  const [lowestItems] = items;
  const [key] = lowestItems;
  return key;
};

const useAutoScroll = (formik: IFormikProp) => {
  const inputRefYPositions = useRef<{[key: string]: number}>({});
  const inputRefs = useRef<{[key: string]: TextInput | null}>({});
  let scrollRef = React.useRef<ScrollView>(null);

  const prevSubmitCountRef = React.useRef(formik.submitCount);
  const {submitCount, isValid, errors} = formik;

  React.useEffect(() => {
    const scrollTo = () => {
      const firstInvalidKey = findFirstErrorElement(inputRefYPositions.current, errors);
      const inputToFocus = inputRefs.current[firstInvalidKey];
      if (inputToFocus) {
        inputToFocus.blur();
        const tm = setTimeout(() => {
          inputToFocus.focus();
          clearTimeout(tm);
        }, 500);
      }
      const yPos = inputRefYPositions.current[firstInvalidKey];
      if (yPos) {
        InteractionManager.runAfterInteractions(() => {
          scrollRef.current?.scrollTo(0, yPos, true);
        });
      }
    };

    if (prevSubmitCountRef.current !== submitCount && !isValid) {
      scrollTo();
    }
    prevSubmitCountRef.current = submitCount;
  }, [submitCount, isValid, errors]);

  const setScrollRef = (ref: React.RefObject<ScrollView>) => {
    if (ref) {
      scrollRef = ref;
    }
  };

  const captureRef = (inputKey: string) => (ref: TextInput | null) => {
    if (ref) {
      inputRefs.current[inputKey] = ref;
    }
  };

  const capturePos = (inputKey: string) => (y: number) => {
    inputRefYPositions.current[inputKey] = y;
  };

  return {
    setScrollRef,
    captureRef,
    capturePos,
  };
};

export default useAutoScroll;
