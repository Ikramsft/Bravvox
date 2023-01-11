export interface People {
  userId: string;
  name: string;
  userName: string;
  profilePic: string;
  tagline: string;
  location: string;
  processingId: number;
  count: number;
  type: string;
  sortId: string;
}

export interface IConnectionActions {
  data: any;
  status: number;
  error: boolean;
  message: string;
}

export interface IConnectionInvalidRequestData {
  sortId: string;
  processingId: number;
}
