import moment from 'moment-timezone';
import {IInputProps} from 'native-base';
import {GroupMemberStatus} from '../screens/Groups/types/GroupInterfaces';
import {theme} from '../theme';
import {isAndroid, SCREEN_WIDTH, SCREEN_HEIGHT} from '../constants/common';
import {EventMemberStatus} from '../screens/Events/types/EventInterfaces';

const {ACCEPTED, INVITED, PENDING, BLOCKED, APPROVE_FOLLOWER, UNFOLLOW, REQUESTED} =
  GroupMemberStatus;

const USERNAMELENGTH = 15;
export function getClassNameByAttendeeResponseStatus(status: string): IInputProps {
  let style: IInputProps = {};
  switch (status) {
    case EventMemberStatus.ACCEPTED:
    case EventMemberStatus.BLOCKED:
      style = {color: theme.colors.black[1000]};
      break;
    case EventMemberStatus.PENDING:
      style = {color: theme.colors.red[900]};
      break;
    default:
      break;
  }
  return {
    ...style,
    textAlign: 'right',
    fontSize: 12,
    textTransform: 'capitalize',
  };
}

export function getClassNameByRelationship(status: string): IInputProps {
  let style: IInputProps = {};
  switch (status.toLowerCase()) {
    case ACCEPTED:
    case BLOCKED:
      style = {color: theme.colors.black[1000]};
      break;
    case INVITED:
    case PENDING:
    case APPROVE_FOLLOWER:
    case UNFOLLOW:
      style = {color: theme.colors.red[900]};
      break;
    case REQUESTED:
      style = {color: theme.colors.gray[300]};
      break;
    default:
      break;
  }
  return {
    ...style,
    textAlign: 'right',
    fontSize: 12,
    textTransform: 'capitalize',
  };
}

export function timeDiffCalc(dateFuture: any, IsMessenger = false) {
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

  let difference = '';
  if (days > 0 && days <= 7) {
    difference = days === 1 ? `${days} day ago` : `${days} days ago`;
    return difference;
  }
  if (days <= 0 && (hours > 0 || minutes >= 0)) {
    if (hours > 0) {
      difference = hours === 1 ? `${hours} hr ago` : `${hours} hrs ago`;
      return difference;
    }
    if (minutes >= 0) {
      difference =
        minutes === 0 || minutes === 1
          ? IsMessenger
            ? 'Now'
            : 'Just now'
          : `${minutes} minutes ago`;
      return difference;
    }
  }
  // return the post created date
  const getCurrentYear =
    dateFuture.getFullYear() !== dateNow.getFullYear() ? dateFuture.getFullYear() : '';
  difference = `${getMonthName(dateFuture.getMonth())}  ${dateFuture.getDate()} ${
    getCurrentYear !== '' ? `, ${getCurrentYear}` : ''
  }`;
  return difference;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const getMonthName = (monthNumber: number) => {
  return monthNames[monthNumber];
};

// const getShortMonthName = function (monthNumber: number) {
//     return getMonthName(monthNumber).substr(0, 3);
// };

const toFixed = (num: any, fixed: number) => {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)[0];
};

export const formatCount = (n: number) => {
  if (n < 1e3) return n;
  if (n >= 1e3 && n < 1e6) {
    return `${+toFixed(n / 1e3, 1)}K`;
  }
  if (n >= 1e6 && n < 1e9) {
    return `${+toFixed(n / 1e6, 1)}M`;
  }
  if (n >= 1e9 && n < 1e12) {
    return `${+toFixed(n / 1e9, 1)}B`;
  }
  return null;
};

export const getFormData = (data: any, allowEmptyOrNull = false): FormData => {
  const formData = new FormData();

  Object.keys(data).map(async key => {
    if (!(data[key] == null || data[key].length === 0) || allowEmptyOrNull) {
      formData.append(key, data[key]);
    }
  });

  return formData;
};

function dateOrdinal(dom: number) {
  if (dom === 31 || dom === 21 || dom === 1) return 'st';
  if (dom === 22 || dom === 2) return 'nd';
  if (dom === 23 || dom === 3) return 'rd';
  return 'th';
}
export const dateFormatter = (d: any, page: any) => {
  const month = page === 'EventList' ? 'MMM' : 'MMMM';
  return `${moment(d).format('dddd')}, ${moment(d).format(month)} ${moment(d).format(
    'DD',
  )}${dateOrdinal(Number(moment(d).format('DD')))} at ${moment(d).format('h:mma')} ${getTimeZone(
    moment.tz.guess(),
    d,
  )}`;
};

const getTimeZone = (t: string, d: string) => {
  const timeZone = moment(d).tz(t).format('ha z');
  const zone = timeZone.split(' ');
  return zone[1].toUpperCase();
};
export const emojisData = [
  {title: ':-) ,:) ,:] ,=) ', code: 1815},
  {title: ':-( ,:( ,:[ ,=( ', code: 1779},
  {title: ':-d ,:d ,=d ,=D ,:D ,-D ', code: 1750},
  {title: '8-| ,8| ,b-| ,b| ,B-| ,B| ', code: 1763},
  {title: ';-) ,;) ', code: 1758},
  {title: ':-o ,:o ,:-O ,:O ', code: 1795},
  {title: ':-p ,:p ,=p ,-P ,:P ,=P ', code: 1776},
];

export const sqlInjectionTxt = `'\b','\0`;
// '\b,\0,\n,\r,\t,\Z';
export const randomName = (length: number) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isValidHttpUrl = (webURL: string) => {
  if (webURL.includes('https') || webURL.includes('http')) {
    return webURL;
  }
  return `https://${webURL}`;
};

export function calculateHeightWidth(imageHeight: number, imageWidth: number, percentage = 1) {
  const ratio = Math.min(SCREEN_HEIGHT / imageHeight, SCREEN_WIDTH / imageWidth);

  const rWidth = imageWidth * ratio * percentage;
  const rHeight = imageHeight * ratio * percentage;

  return {
    height: !Number.isNaN(rHeight) ? rHeight : SCREEN_WIDTH * 0.7,
    width: !Number.isNaN(rWidth) ? rWidth : SCREEN_WIDTH,
  };
}

export function calculateImageHeightWidth(uri: string) {
  const uriArr = uri?.split('?')?.[0];

  // eslint-disable-next-line no-unsafe-optional-chaining
  const filename = uriArr?.substring(uriArr?.lastIndexOf('/') + 1);
  const dimensions = filename.match(/_[0-9]*x[0-9]*./);

  const [imageWidth, imageHeight] = dimensions?.[0].slice(1, -1).split('x') || [];

  return calculateHeightWidth(parseFloat(imageHeight), parseFloat(imageWidth));
}

export function getImageExtension(uri: string) {
  const uriArr = uri?.split('?')?.[0];

  // eslint-disable-next-line no-unsafe-optional-chaining
  const filename = uriArr?.substring(uriArr?.lastIndexOf('/') + 1);
  const uriArr2 = filename?.split('.')?.[1];
  return {uriArr2, filename};
}

export const getNotificationType = (type: number) => {
  if (type >= 1 && type <= 3) {
    return 'profile';
  }
  if (type === 4) {
    return 'post';
  }
  if (type >= 5 && type <= 11) {
    return 'selfPost';
  }
  if (type === 14 || type === 44) {
    return 'groupProfile';
  }

  if (type === 12 || type === 13 || type === 15 || type === 16 || type === 17 || type === 18) {
    return 'groupProfileSingleScreen';
  }
  if (
    type === 20 ||
    type === 27 ||
    type === 28 ||
    type === 31 ||
    type === 32 ||
    type === 33 ||
    type === 34
  ) {
    return 'eventProfile';
  }
  if (type === 22 || type === 21) {
    return 'eventProfileSingleScreen';
  }
  return '';
};

export const checkIfEventStarted = (eventStartTime: string) => {
  const currentDateTime = new Date();
  const localEventStartDateTime = new Date(eventStartTime);
  return currentDateTime > localEventStartDateTime;
};

export const truncateUsername = (str='') => {
  const ellipsis = '...';
  if (str.length > USERNAMELENGTH) {
    return str.slice(0, USERNAMELENGTH - ellipsis.length) + ellipsis;
  }
  return str;
};
