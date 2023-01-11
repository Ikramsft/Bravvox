export interface INewEventData {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  details?: string;
  eventStartTime: any;
  eventEndTime?: any;
  location: string;
  isPostingOpen: boolean;
  isPublic: boolean;
  isModerated: boolean;
  requireAttendeeApproval: boolean;
  avatarViewAttribute: any;
  owner: {
    attendeeResponseStatus: string;
    coverPic: string;
    id: string;
    name: string;
    profilePic: string;
    profilePicThumb: string;
    role: string;
    status: string;
    userName: string;
    user_id: string;
  };
  pictureViewAttribute: any;
  status: string;
  totalAttendees: string;
  croppedPictureURL: string;
  croppedAvatarURL: string;
  avatarReadURL: string;
  pictureReadURL: string;
}

export interface IAttendeesData {
  attendeeResponseStatus: string;
  coverPic: string;
  id: string;
  userName: string;
  name: string;
  profilePic: string;
  profilePicThumb: string;
  role: string;
  status: string;
  user_id: string;
}

export enum EventRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEFAULT = 'default',
}
export enum EventPageFunctions {
  CREATE = 'create',
  EDIT = 'edit',
}

export enum EventMemberStatus {
  ACCEPTED = 'accepted',
  INVITED = 'invited',
  PENDING = 'pending',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
  REQUESTED = 'Requested',
}
export type EventMemberFilterStatus =
  | 'all'
  | 'accepted'
  | 'pending'
  | 'not attending'
  | 'did not respond'
  | 'blocked'
  | 'invited'
  | 'rejected'
  | 'maybe'
  | '';

export enum EventStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  CANCELLED = 'canceled',
}

export interface eventResponse {
  code: number;
  data?: INewEventData;
  error: boolean;
  message: string;
  status: number;
}

export interface IEventData {
  edit: boolean;
  data?: INewEventData | null;
}
