/**
 * @format
 */
import * as React from 'react';
import {StackActions, NavigationContainerRef} from '@react-navigation/native';
import {RootStackParamList} from '.';

export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function push(name: keyof RootStackParamList, params?: any) {
  navigationRef.current?.dispatch(StackActions.push(name, params));
}

export function currentRoute() {
  return navigationRef?.current?.getCurrentRoute()?.name;
}
