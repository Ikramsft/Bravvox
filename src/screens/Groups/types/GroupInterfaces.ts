export interface IGroupMemberStatusState {
  id: string;
  status: string;
  user_id: string;
  role: string;
  name: string;
  userName: string;
  profilePic: string;
  profilePicThumb: string;
}

type GroupStatusType = 'active' | 'deactivated';

export interface IGroupCardInfo {
  about: string;
  avatarReadURL: string;
  email: string;
  guidelines: string;
  id: string;
  isModerated: boolean;
  isPrivate: boolean;
  name: string;
  handle: string;
  phone: string;
  pictureReadURL: string;
  postingIsPublic: boolean;
  requireMemberApproval: boolean;
  status: GroupStatusType;
  tagline: string;
  totalMembers: number;
  totalMembersCount: number;
  totalFollowersCount: number;
  webUrl: string;
  error: string;
  totalFollowers: number;
}

export interface IListGroupsData {
  groups: IGroupCardInfo[];
  totalCount: number;
}

export interface IMembersData {
  id: string;
  name: string;
  user_id: string;
  userName: string;
  profilePicThumb: string;
  profilePic: string;
  status: string;
  role: string;
  coverPic: string;
  influencerStatus: boolean;
}

export enum GroupStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
}

export enum GroupRoles {
  OWNER = 'owner',
  ADMIN = 'admin',
  DEFAULT = 'default',
}

export enum GroupMemberStatus {
  ACCEPTED = 'accepted',
  INVITED = 'invited',
  PENDING = 'pending',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
  UNFOLLOW = 'unfollow',
  UNBLOCKED = 'unblock',
  APPROVE_FOLLOWER = 'approve follower',
  REQUESTED = 'requested',
}

export enum MemberActionTypes {
  CANCEL_REQUEST = 'Cancel Request',
  APPROVE_MEMBER = 'Approve Member',
  REJECT_MEMBER = 'Reject Member',
  BLOCK = 'Block',
  UNBLOCK = 'Unblock',
  REPORT_ABUSE = 'Report Abuse',
  FOLLOW = 'Follow',
  UNFOLLOW = 'Unfollow',
}

export interface INewGroupData {
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
  requireMemberApproval: boolean;
  avatarReadURL: string;
  pictureReadURL: string;
}
