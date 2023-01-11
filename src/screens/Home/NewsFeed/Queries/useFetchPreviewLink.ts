/* eslint-disable @typescript-eslint/no-explicit-any */
import {config} from '../../../../config';
import client from '../../../../utils/ApiClient';

export interface IResponseData {
  data: any;
  error: boolean;
  message: string;
  status: number;
  [Key: string]: any;
}

export interface ILinkPreviewVideo {
  url: string;
  secure_url: string;
  type: string;
  height: number;
  width: number;
  duration: 0;
}

export interface ILinkPreview {
  description: string;
  hostname: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
  width: number;
  isVideo: boolean;
  videoURL: ILinkPreviewVideo;
}

export const fetchPreview = async (url?: string, component?: string) => {
  let newurl;
  try {
    switch (component) {
      case 'group':
        newurl = `${config.GROUP_API_URL}group/og?urls=${url}`;
        break;
      case 'event':
        newurl = `${config.EVENTS_API_URL}event/og?urls=${url}`;
        break;
      case 'comments':
      case 'profile':
      case 'home':
      default:
        newurl = `${config.CONTENT_API_URL}content/og?urls=${url}`;
    }
    const response = await client.get(newurl);
    if (response.status === 200) {
      return {data: response.data, status: response.status};
    }
    return {data: null, status: false};
  } catch (error: any) {
    return error;
  }
};

const useFetchPreviewLink = () => {
  const fetchPreviewLinkData = async (url: string, from: string) => {
    const response = await fetchPreview(url, from);
    return response;
  };
  return {fetchPreviewLinkData};
};

export {useFetchPreviewLink};
