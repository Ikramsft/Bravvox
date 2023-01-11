/**
 * @format
 */
import React, {useEffect} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {useTheme, View} from 'native-base';
import {EventRegister} from 'react-native-event-listeners';

import {RichToolbar, RichEditor, actions} from '../lib/richtexteditor/src/index';
import {theme} from '../theme';
import {RenderError} from './FloatingInput';

interface IHtmlEditorProps {
  value: string | undefined;
  placeholder: string;
  onChange: ({data, text}: {data: string; text: string}) => void;
  style?: StyleProp<ViewStyle>;
  toolStyle?: StyleProp<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
  selectedButtonStyle?: StyleProp<ViewStyle>;
  error: string | undefined;
}

const editorStyle = {
  backgroundColor: 'white',
  placeholderColor: theme.colors.black[300],
  ol: {fontSize: 200},
  ul: {fontSize: 12},
};

const defaultStyle: StyleProp<ViewStyle> = {height: 110};

const defaultToolStyle: StyleProp<ViewStyle> = {
  alignItems: 'flex-start',
  backgroundColor: theme.colors.white,
  borderBottomColor: theme.colors.black[200],
  borderBottomWidth: 1,
};

const defaultItemStyle: StyleProp<ViewStyle> = {
  borderRightColor: theme.colors.black[200],
  borderRightWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
};

const defaultSelectedButtonStyle: StyleProp<ViewStyle> = {
  borderRightColor: theme.colors.white,
  borderRightWidth: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.black[200],
};

export function HtmlEditor(props: IHtmlEditorProps) {
  const {value, placeholder, onChange, style, toolStyle, itemStyle, selectedButtonStyle, error} =
    props;
  const editorRef = React.useRef(null);
  const {colors} = useTheme();

  const borderColor = error ? colors.red[500] : '#e8e8e8';
  const focusColor = colors.blue[700];
  const [focus, setFocus] = React.useState(false);

  useEffect(() => {
    const eventListner: any = EventRegister.addEventListener('keyboardDismiss', data => {
      if (data === 'yes') {
        editorRef?.current.dismissKeyboard();
      }
    });
    return () => {
      EventRegister.removeEventListener(eventListner);
    };
  });
  return (
    <>
      <View
        borderColor={focus && !error ? focusColor : borderColor}
        borderWidth={1}
        overflow="hidden">
        <RichToolbar
          actions={[actions.setBold, actions.insertBulletsList, actions.insertOrderedList]}
          editor={editorRef}
          iconGap={25}
          itemStyle={itemStyle}
          selectedButtonStyle={selectedButtonStyle}
          selectedIconTint="black"
          style={toolStyle}
        />
        <RichEditor
          editorStyle={editorStyle}
          initialContentHTML={value}
          placeholder={placeholder}
          ref={editorRef}
          style={style}
          useContainer={false}
          onBlur={() => setFocus(false)}
          onChange={onChange}
          onFocus={() => setFocus(true)}
        />
      </View>
      <RenderError error={error} />
    </>
  );
}

HtmlEditor.defaultProps = {
  style: defaultStyle,
  toolStyle: defaultToolStyle,
  itemStyle: defaultItemStyle,
  selectedButtonStyle: defaultSelectedButtonStyle,
};
