import React from "react";
import { Provider as JotaiProvider } from "jotai";

export const AppProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <JotaiProvider>{children}</JotaiProvider>;
};
