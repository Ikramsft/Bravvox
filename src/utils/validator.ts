import {Alert} from 'react-native';

const VideoMimetypes: {[key: string]: string} = {
  'video/x-matroska': 'mkv',
  'video/x-msvideo': 'avi',
  'video/avi': 'avi',
  'video/mp4': 'mp4',
  'video/3gpp': '3gp',
};
const allowedVideoTypes = ['mkv', 'avi', 'mp4', '3gp'];

// Size Validation
export function validateFileSize(fileSize: number, maxFileSize: number) {
  const size: number = Math.round(fileSize / 1024);
  return size <= 1024 * maxFileSize;
}

// Video Validation
function validateVideoType(type: string, allowedExtensions: string[]) {
  const typeFromMime = VideoMimetypes[type];
  const allowed = allowedExtensions.includes(typeFromMime);
  return allowed;
}

export function getVideoExtension(type: string) {
  const typeFromMime = VideoMimetypes[type];
  return typeFromMime ?? 'mp4';
}

export const validateVideo = (type: string, size: number) => {
  const isVideo: boolean = type.includes('video');
  if (isVideo && !validateVideoType(type, allowedVideoTypes)) {
    Alert.alert(
      'Unsupported',
      'File format is not supported. Please select mp4 format.',
    );
    return false;
  }
  const isFileSizeValid: boolean = validateFileSize(size, 250);
  if (!isFileSizeValid) {
    Alert.alert('Size Limit', 'Your video exceeds the maximum limit of 25 MB.');
    return false;
  }
  return true;
};

// Image Validation

const allowedImageExtensions = /(\.jpg|\.jpeg|\.gif|\.png)$/i;

function validateImageType(name: string, allowedExtensions: RegExp) {
  return allowedExtensions.exec(name);
}

export const validateImage = (
  name: string,
  type: string,
  size: number,
  allowedSize: number,
  allowedExtensions = allowedImageExtensions,
) => {
  const isImage: boolean = type.includes('image');
  if (isImage && !validateImageType(name, allowedExtensions)) {
    Alert.alert(
      'Unsupported',
      'File format is not supported. Please select one of the following file types: jpg, jpeg, png or gif.',
    );
    return false;
  }
  const isFileSizeValid: boolean = validateFileSize(size, allowedSize);
  if (!isFileSizeValid) {
    Alert.alert('Size Limit', `Your image exceeds the maximum limit of ${allowedSize} MB.`);
    return false;
  }
  return true;
};
