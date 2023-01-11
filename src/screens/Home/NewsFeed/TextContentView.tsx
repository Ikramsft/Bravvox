import {Text, useColorModeValue, useTheme, View} from 'native-base';
import React, {useCallback, useRef, useState} from 'react';
import {
  Linking,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  TextLayoutEventData,
  ViewStyle,
} from 'react-native';
import ParsedText from 'react-native-parsed-text';
import SafeTouchable from '../../../components/SafeTouchable';
import {processContentString} from '../../../constants/common';
import LinkReview from './LinkReview';

type IProps = {
  content: string;
  numOfLines?: number;
  collapse?: boolean;
  from?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const renderEmoji = (matchString: string, matches: any[]) => {
  try {
    return String.fromCodePoint(matches?.[0]);
  } catch (error) {
    return matchString;
  }
};

function TextContentView(props: IProps) {
  const {content, from, collapse = false, numOfLines = 3, containerStyle} = props;

  const textRef = useRef(null);

  const {colors} = useTheme();
  const textColor = useColorModeValue(colors.black['950'], colors.white);

  const handleUrlPress = (url: string) => Linking.openURL(url);

  const [totalLines, setTotalLines] = useState(0);
  const [isSeeMore, setIsSeeMore] = useState(false);

  const handleSeeMore = () => setIsSeeMore(!isSeeMore);

  const onLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setTotalLines(e.nativeEvent.lines.length);
  }, []);

  const matches = content.match(/\bhttps?:\/\/\S+/gi);
  const uniqueMatches: string[] = [];
  matches?.forEach(c => {
    if (!c.match(/<\/?[\w\s="/.':;#-\\?]+>/gi)) {
      uniqueMatches.push(c);
    }
  });

  const renderContent = () => (
    <>
      <ParsedText
        childrenProps={{allowFontScaling: false}}
        ellipsizeMode="clip"
        // numberOfLines={!isSeeMore ? numOfLines : undefined}
        parse={[
          {
            type: 'url',
            style: {...styles.url, color: colors.blue[600]},
            onPress: handleUrlPress,
          },
          {pattern: /0x[0-9a-z]*/, renderText: renderEmoji},
        ]}
        style={[styles.textStyle, {color: textColor}]}>
        {processContentString(content)}
      </ParsedText>
      {uniqueMatches && uniqueMatches.length > 0 && (
        <LinkReview darkBorder={from === 'comments'} from={from || ''} url={uniqueMatches[0]} />
      )}
    </>
  );

  if (!collapse) {
    return renderContent();
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {totalLines === 0 && (
        <Text color="transparent" position="absolute" ref={textRef} onTextLayout={onLayout}>
          {content}
        </Text>
      )}
      {renderContent()}
      {totalLines > numOfLines && (
        <SafeTouchable onPress={handleSeeMore}>
          <Text mt={1}>{!isSeeMore ? 'see more...' : 'see less...'}</Text>
        </SafeTouchable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 8,
  },
  url: {
    textDecorationLine: 'underline',
    fontFamily: 'DMSANS-Regular',
    fontSize: 14,
  },
  textStyle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
  },
});

TextContentView.defaultProps = {
  collapse: false,
  numOfLines: 3,
  from: '',
  containerStyle: {},
};

export default TextContentView;
