import React from 'react';
import {InputAccessoryView, InputAccessoryViewProps} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {isIOS} from '../../constants/common';

interface IRenderInputAccessory extends InputAccessoryViewProps {
  children: (inside: IContentProps) => React.ReactNode;
}

interface IContentProps {
  inside: boolean;
  inputAccessoryViewID: string;
}

function RenderInputAccessory(props: IRenderInputAccessory) {
  const {children} = props;
  const inputAccessoryViewID = 'input-toolbar-input-view-id';
  // const [text, setText] = useState('');
  // return isAndroid ? (
  //   <View>{children}</View>
  // ) : (
  //   <InputAccessoryView backgroundColor="#fffffff7" nativeID={nativeID}>{children}</InputAccessoryView>
  // );

  return (
    <SafeAreaView edges={['bottom']}>
      {children({inside: false, inputAccessoryViewID})}
      {isIOS && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          {children({inside: true, inputAccessoryViewID})}
        </InputAccessoryView>
      )}
    </SafeAreaView>
  );
}

export default RenderInputAccessory;
