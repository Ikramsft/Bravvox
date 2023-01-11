/**
 * @format
 */
import React from 'react';

interface IConditionalProps {
  children: React.ReactElement;
  condition: boolean;
  wrapper: (children: React.ReactElement) => React.ReactElement;
}

export const ConditionalWrapper = ({ condition, wrapper, children }: IConditionalProps) =>
  condition ? wrapper(children) : children;