/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @format
 */
import ReactNativeBlobUtil from 'react-native-blob-util';
import moment from 'moment';
import {isNull, isUndefined, isEmpty, get} from 'lodash';

import {Dimensions, KeyboardEventName, Platform} from 'react-native';
import {randomName} from '../utils';

export const KEYBOARD_EXTRA_HEIGHT = 350;
export const NAME_REGEX = /^[a-zA-Z ]{2,30}$/;
export const PHONE_REGEX = /^((\()?[1-9]{1}[0-9]{2}(\))?)[\s-]?[0-9]{3}[\s-]?[0-9]{4}$/;
export const URL_REGEX =
  /^((https?):\/\/)?(([w|W]{3}\.)?)+[a-zA-Z0-9\-.]{3,}\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/;
export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;
export const SCREEN_FLOATING_BUTTON = SCREEN_HEIGHT * 0.12;

export const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const isAndroid = Platform.OS === 'android';
export const isIOS = Platform.OS === 'ios';

export const formatPhoneNumber = (number: string) => {
  const cleaned = number.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return ['(', match[1], ') ', match[2], '-', match[3]].join('');
  }
  return cleaned;
};

export const getValue = (object: object, path: string, defaultVal: unknown) => {
  const val = get(object, path, defaultVal);

  if (isNull(val)) {
    return defaultVal;
  }

  if (isUndefined(val)) {
    return defaultVal;
  }

  if (typeof val === 'boolean') {
    return val;
  }

  if (typeof val !== 'number' && isEmpty(val)) {
    return defaultVal;
  }

  return val;
};

export const findDuration = (fromDate: string | Date | number) => {
  const date1 = moment(fromDate);
  const date2 = moment(new Date());
  const years = date2.diff(date1, 'years');
  if (years > 0) {
    return `${years}y`;
  }
  const months = date2.diff(date1, 'months');
  if (months > 0) {
    return `${months}m`;
  }
  const days = date2.diff(date1, 'days');
  if (days === 1) {
    return 'Yesterday';
  }
  if (days > 0) {
    return `${days}d`;
  }
  const hours = date2.diff(date1, 'hours');
  if (hours > 0) {
    return `${hours}h`;
  }
  const minutes = date2.diff(date1, 'minutes');
  if (minutes > 0) {
    return `${minutes}min`;
  }
  const seconds = date2.diff(date1, 'seconds');
  if (seconds > 0) {
    return `${seconds}s`;
  }
  return 'Just Now';
};

export async function removeFileFromCache(uri: string) {
  await ReactNativeBlobUtil.fs.unlink(uri.split('file://')[1]);
}

type SaveCroppedImageParams = {
  name: string;
  type: string;
  uri: string;
};

export async function saveImageOnCache(params: SaveCroppedImageParams) {
  try {
    const {name, type, uri: base64} = params;
    const imageData = base64.split('base64,')[1];
    const filePath = ReactNativeBlobUtil.fs.dirs.CacheDir;
    const dest = `${filePath}/${name}`;
    await ReactNativeBlobUtil.fs.writeFile(dest, imageData, 'base64');
    return {name, type, uri: `file://${dest}`};
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function saveBase64OnCache(data: string) {
  try {
    const croppedFileType = data.split(';')[0].split('/')[1];
    const croppedFileName = `${randomName(8)}.${croppedFileType}`;
    const type = `image/${croppedFileType}`;
    const croppedFile = {name: croppedFileName, type, uri: data};
    return await saveImageOnCache(croppedFile);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function timeDiffCalcForMessenger(dateFuture: any) {
  if (dateFuture) {
    const dateNow: any = new Date();
    dateFuture = new Date(dateFuture);

    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;

    if (days >= 365) {
      return moment(dateFuture).format('MM/DD/YY');
    }

    if (days >= 7 && days < 365) {
      return moment(dateFuture).format('MMM D');
    }

    if ((days > 0 && days < 7) || moment().format('ddd') !== moment(dateFuture).format('ddd')) {
      return moment(dateFuture).format('ddd');
    }

    if (days <= 0 && (hours > 0 || minutes >= 0)) {
      if (hours > 0) {
        return moment(dateFuture).format('h:mm A');
      }
      if (minutes >= 0) {
        return minutes === 0 || minutes === 1 ? `Now` : `${minutes}m`;
      }
    }
  }
  return '';
}

export const KEYBOARD_SHOW: KeyboardEventName =
  Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
export const KEYBOARD_HIDE: KeyboardEventName =
  Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

export const COLOR_MODE_KEY = '@color-mode';

export const processContentString = (string: string) => {
  const result = string
    .replace(/&nbsp;/g, ' ')
    .replace(/<br>/g, '\n')
    .replace(/<div>/g, '')
    .replace(/<p>/g, '')
    .replace(
      /<div class="editable" disabled="" draggable="false" placeholder="Add a Comment" contenteditable="false">/g,
      '',
    )
    .replace(/<\/div>/g, '')
    .replace(/<\/p>/g, '')
    .replace(/<\/?a[^>]*>/g, '')
    .replace(
      /<img class="suggestedEmoji" src="https:\/\/cdn\.jsdelivr\.net\/npm\/emoji-datasource-apple@6\.0\.1\/img\/apple\/64\//g,
      '0x',
    )
    .replace(/\.png">/, '');
  return result;
};

function emojiUnicode(emoji: string) {
  let comp;
  if (emoji.length === 1) {
    comp = emoji.charCodeAt(0);
  }
  comp = (emoji.charCodeAt(0) - 0xd800) * 0x400 + (emoji.charCodeAt(1) - 0xdc00) + 0x10000;
  if (comp < 0) {
    comp = emoji.charCodeAt(0);
  }
  return comp.toString(16);
}

type PatternType = {pattern: RegExp; conversion: (text: string, matches: string[]) => string};
type ParsedTextType = {children: string; matched?: boolean};

function parse(text: string, patterns: PatternType[]) {
  let parsedTexts: ParsedTextType[] = [{children: text}];
  patterns.forEach(pattern => {
    const newParts: ParsedTextType[] = [];

    const tmp = 0;
    const numberOfMatchesPermitted = Math.min(
      Math.max(Number.isInteger(tmp) ? tmp : 0, 0) || Number.POSITIVE_INFINITY,
      Number.POSITIVE_INFINITY,
    );

    let currentMatches = 0;

    parsedTexts.forEach(parsedText => {
      // Only allow for now one parsing
      if (parsedText.matched) {
        newParts.push(parsedText);
        return;
      }

      const parts = [];
      let textLeft = parsedText.children;

      /** @type {RegExpExecArray} */
      let matches;
      // Global RegExps are stateful, this makes it start at 0 if reused
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
      pattern.pattern.lastIndex = 0;
      // eslint-disable-next-line no-cond-assign
      while (textLeft && (matches = pattern.pattern.exec(textLeft))) {
        const previousText = textLeft.substr(0, matches.index);

        // eslint-disable-next-line no-plusplus
        if (++currentMatches > numberOfMatchesPermitted) {
          // Abort if we've exhausted our number of matches
          break;
        }

        parts.push({children: previousText});

        parts.push(getMatchedPart(pattern, matches[0], matches));

        textLeft = textLeft.substr(matches.index + matches[0].length);
        // Global RegExps are stateful, this makes it operate on the "remainder" of the string
        pattern.pattern.lastIndex = 0;
      }

      parts.push({children: textLeft});

      newParts.push(...parts);
    });

    parsedTexts = newParts;
  });
  parsedTexts.forEach(parsedText => delete parsedText.matched);
  return parsedTexts.filter(t => !!t.children);
}

/**
 * @protected
 * @param {ParseShape} matchedPattern - pattern configuration of the pattern used to match the text
 * @param {String} text - Text matching the pattern
 * @param {String[]} matches - Result of the RegExp.exec
 * @return {Object} props for the matched text
 */
function getMatchedPart(matchedPattern: PatternType, text: string, matches: RegExpExecArray) {
  let children = text;
  if (matchedPattern.conversion && typeof matchedPattern.conversion === 'function') {
    children = matchedPattern.conversion(text, matches);
  }

  return {
    children,
    matched: true,
  };
}

const convertUrlToAnchor = (matchString: string) => {
  try {
    return `<a href="${matchString}" target="_blank" rel="noopener noreferrer">${matchString}</a>`;
  } catch (error) {
    return matchString;
  }
};

const convertEmojiToImg = (matchString: string) => {
  try {
    return `<img class="suggestedEmoji" src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple@6.0.1/img/apple/64/${emojiUnicode(
      matchString,
    )}.png">`;
  } catch (error) {
    return matchString;
  }
};

export const convertTextToHtmlForNewsFeed = (text: string) => {
  const processedText = text.replace(/\s+$/g, '').replace(/\n/g, '<br>');
  const urlPattern: PatternType = {
    pattern:
      /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_+[\],.~#?&/=]*[-a-zA-Z0-9@:%_+\]~#?&/=])*/i,
    conversion: convertUrlToAnchor,
  };

  const unified_emoji_ranges = [
    '\ud83c[\udf00-\udfff]',
    '\ud83d[\udc00-\ude4f]',
    '\ud83d[\ude80-\udeff]',
  ];

  const emojiPattern: PatternType = {
    pattern: new RegExp(unified_emoji_ranges.join('|'), 'g'),
    conversion: convertEmojiToImg,
  };

  const updText = parse(processedText, [urlPattern, emojiPattern]);

  const newText = updText.map(t => t.children).join('');

  const finalText = `<div class="editable" disabled="" draggable="false" placeholder="Add a Comment" contenteditable="false">${newText}</div>`;

  return finalText;
};
