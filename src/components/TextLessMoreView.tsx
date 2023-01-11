import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, ViewStyle, TouchableOpacity, TextProps} from 'react-native';
import ParsedText, {CustomParseShape, DefaultParseShape} from 'react-native-parsed-text';

type ParseShape = DefaultParseShape | CustomParseShape;

interface PropTypes {
  text: string;
  containerStyle?: ViewStyle;
  parse: ParseShape[];
  childrenProps: TextProps;
  parsedStyle?: ViewStyle;
  seeMoreLessTextStyle?: ViewStyle;
  maxLine: number;
  onTextPress?: () => void;
}

function TextLessMoreView(props: PropTypes) {
  const {
    text,
    containerStyle,
    parse,
    childrenProps,
    parsedStyle,
    seeMoreLessTextStyle,
    maxLine,
    onTextPress,
  } = props;
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState<number>();
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);

  const onTextLayout = useCallback(
    e => {
      if (e.nativeEvent.lines.length > maxLine && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(maxLine);
      }
    },

    [showText, maxLine],
  );

  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : maxLine);
    }
  }, [showText, showMoreButton, maxLine]);

  return (
    <View style={containerStyle}>
      <ParsedText
        childrenProps={childrenProps}
        numberOfLines={numberOfLines}
        parse={parse}
        style={parsedStyle}
        onPress={onTextPress}
        onTextLayout={onTextLayout}>
        {text?.trim()}
      </ParsedText>
      {showMoreButton && (
        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={1}
          onPress={() => setShowText(!showText)}>
          <Text style={seeMoreLessTextStyle}>{showText ? 'see less' : 'see more'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
TextLessMoreView.defaultProps = {
  containerStyle: {},
  parsedStyle: {},
  seeMoreLessTextStyle: {},
  onTextPress: null,
};

export default TextLessMoreView;
