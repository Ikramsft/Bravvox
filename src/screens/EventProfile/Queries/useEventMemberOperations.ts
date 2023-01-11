import {useDisclose} from 'native-base';

const useEventMemberOperations = () => {
  const sheetActions = useDisclose();

  return {
    ...sheetActions,
  };
};

export {useEventMemberOperations};
