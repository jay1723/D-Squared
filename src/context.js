import React, { useContext } from "react"; 

export const RootContext = React.createContext();
export const RootProvider = RootContext.Provider;

export function useRootContext() {
    return useContext(RootContext); 
}