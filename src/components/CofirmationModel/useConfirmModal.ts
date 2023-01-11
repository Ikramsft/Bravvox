import React from 'react';
import ConfirmModalContext from './ConfirmModalContext';

export default function useConfirmModal() {
  return React.useContext(ConfirmModalContext);
}
