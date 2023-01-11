import React from "react";
import { ConfirmModalContextType } from "./ConfirmModalProvider";

const ConfirmModalContext = React.createContext<ConfirmModalContextType | undefined>(
  undefined
);
export default ConfirmModalContext;
