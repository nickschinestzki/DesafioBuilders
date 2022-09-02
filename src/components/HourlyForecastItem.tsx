import React, { ReactNode, useMemo } from "react"
import { View, StyleSheet, Text, Image } from "react-native"

import { format } from "date-fns";
import { getWeatherIcon } from "../utils"
import { useTheme } from "../contexts/ThemeContext";
import { WeatherForecastData } from "../types/Weather";

import LinearGradient from "react-native-linear-gradient";

interface HourlyForecastItemProps {
   data: WeatherForecastData;
   isCurrentHour: boolean;
}
export function HourlyForecastItem({ data, isCurrentHour }: HourlyForecastItemProps) {
   return (
      <Container isCurrentHour={isCurrentHour}>
         <Text style={sheet.temperature}>
            {data.main.temp.toFixed(0)}º
         </Text>

         <Image
            resizeMode="contain"
            style={sheet.weatherIcon}
            source={getWeatherIcon(data.weather[0].icon)}
         />

         <Text style={[sheet.hour, { color: isCurrentHour ? "#cecece" : "#898989" }]}>
            {format(new Date(data.dt * 1000), "HH:mm")}
         </Text>
      </Container>
   )
}

interface ContainerProps {
   isCurrentHour: boolean;
   children: ReactNode;
}
function Container({ isCurrentHour, children }: ContainerProps) {
   const { isNightTime } = useTheme()

   const gradientColors = useMemo(() => {
      if (isNightTime)
         return ["#005C97", "#363795"]
      else
         return ["#37B7EC", '#1D6CF0']
   }, [isNightTime])

   if (isCurrentHour)
      return (
         <LinearGradient
            useAngle
            angle={200}
            style={sheet.container}
            colors={gradientColors}
         >
            {children}
         </LinearGradient>
      )
   else
      return (
         <View style={sheet.container}>
            {children}
         </View>
      )
}

const sheet = StyleSheet.create({
   container: {
      width: 72,
      borderRadius: 24,
      marginRight: 8,
      paddingVertical: 8,
      flexDirection: "column",
      alignItems: "center",
   },
   temperature: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Lato",
      textAlign: "center",
      color: "#ffffff",
   },
   weatherIcon: {
      width: 40,
      height: 40,
      marginVertical: 4,
   },
   hour: {
      fontSize: 14,
      fontWeight: "bold",
      fontFamily: "Lato",
      color: "#898989",
   }
})