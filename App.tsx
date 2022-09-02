import React from 'react';
import { Homepage } from './src/pages/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeProvider } from './src/contexts/ThemeContext';
const App = () => {
   return (
      <GestureHandlerRootView style={{ flex: 1 }}>
         <SafeAreaProvider>
            <ThemeProvider>
               <Homepage />
            </ThemeProvider>
         </SafeAreaProvider>
      </GestureHandlerRootView>
   );
};

export default App;
