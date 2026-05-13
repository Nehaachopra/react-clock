import { createContext, useContext, ReactNode, useState, Dispatch, SetStateAction } from "react";

const ClockContext = createContext(null);

type Modes = 'clock' | 'timer' | 'stopwatch' | 'alarm';
interface CLockContextProviderProps {
  children : ReactNode
}

interface ClockContextType {
  mode: Modes;
  setIsMultiPlayer: Dispatch<SetStateAction<boolean>>;
}

export function ClockContextProvider({children}: CLockContextProviderProps) {
  const [mode, setMode] = useState<Modes>("clock");

  return (
    <ClockContext.Provider value={{setMode}}>
      {children}
    </ClockContext.Provider>
  )
}

export function UseClockContext() {
  const useClockContext = useContext(ClockContext)
  if (!useClockContext) {
    throw Error(
      "useClockContext must be used inside ClockContextProvider"
    );
  }
  return useClockContext;
}