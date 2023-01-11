/**
 * @format
 */

export type MemberShipStatus = 'all' | 'accepted' | 'pending' | 'blocked' | '';
export type ActionRequest = 'approve' | 'reject' | 'accepted';
export type FollowType =
  | 'following'
  | 'followed'
  | 'approve_followers'
  | 'not_following'
  | 'blocked'
  | 'requested';
export type FromType = 'following' | 'followed';
export type ActionBlockUnblock =
  | 'block'
  | 'blocked'
  | 'unblock'
  | 'accepted'
  | 'approve'
  | 'reject';
export const EventDateDisplayFormat = 'MM/DD/YYYY hh:mm A';
