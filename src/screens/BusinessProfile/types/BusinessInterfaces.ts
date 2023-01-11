export interface INewBusinessData {
  id: string;
  name: string;
  owner: {
    id: string;
    status: string;
    user_id: string;
    role: string;
  };
  about: string;
  tagline: string;
  guidelines: string;
  isModerated: boolean;
  postingIsPublic: boolean;
  webUrl: string;
  email: string;
  phone: string;
  isPrivate: boolean;
  status: string;
  totalFollowersCount: number;
  requireMemberApproval: boolean;
  avatarReadURL: string;
  pictureReadURL: string;
  error: string;
  address: string;
  requireFollowerApproval: boolean;
  croppedPictureReadURL: string;
  croppedAvatarReadURL: string;
}

export enum BusinessPageRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEFAULT = 'default',
}

export enum BusinessPageFollowerStatus {
  ACCEPTED = 'accepted',
  INVITED = 'invited',
  PENDING = 'pending',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

export enum BusinessPageFunctions {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum BusinessPageTypes {
  RECENT_BUSINESS_PAGE = 'Recent Business Pages',
  POPULAR_BUSINESS_PAGE = 'Popular Business Pages',
  MY_BUSINESS_PAGE = 'My Business Pages',
}

export enum BusinessPageStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

export enum BusinessPageResponseCodes {
  BLOCKED_FOLLOWER_CODE = 10001,
  DEACTIVATED_BUSINESS_PAGE_CODE = 10002,
  REACTIVATED_BUSINESS_PAGE_CODE = 10003,
}

export interface IBusinessMemberStatusState {
  id: string;
  status: string;
  user_id: string;
  role: string;
  name: string;
  userName: string;
  profilePic: string;
  profilePicThumb: string;
}
export interface businessResponse {
  code: number;
  data?: INewBusinessData;
  error: boolean;
  message: string;
  status: number;
}
export interface IBusinessData {
  edit: boolean;
  data?: INewBusinessData|null;
}
