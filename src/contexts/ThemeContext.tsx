import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"

interface ThemeProviderProps {
   children: ReactNode;
}
type ThemeContextData = {
   isNightTime: boolean;
   setIsNightTime: (value: boolean) => void;
}
const ThemeContext = createContext({} as ThemeContextData)

export function useTheme() {
   const context = useContext(ThemeContext)

   return context
}

export function ThemeProvider({ children }: ThemeProviderProps) {
   const [isNightTime, setIsNightTime] = useState(false)

   return (
      <ThemeContext.Provider value={{ isNightTime, setIsNightTime }}>
         <>
            {children}
         </>
      </ThemeContext.Provider >
   )
}
