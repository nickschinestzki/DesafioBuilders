import React from "react"
import { View, StyleSheet, Text, Image } from "react-native"

import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { getWeatherIcon } from "../utils";
import { WeatherForecastData } from "../types/Weather";

interface DailyForecastItemProps {
   data: WeatherForecastData;
}
export function DailyForecastItem({ data }: DailyForecastItemProps) {
   return (
      <View style={sheet.container}>
         <Text style={[sheet.text, { textTransform: "uppercase" }]}>
            {format(new Date(data.dt * 1000), "iiiiii", { locale: ptBR })}
         </Text>

         <View style={sheet.weatherWrapper}>
            <Image
               resizeMode="contain"
               style={sheet.weatherIcon}
               source={getWeatherIcon(data.weather[0].icon)}
            />

            <Text style={[sheet.text, sheet.weatherDescription]}>
               {data.weather[0].description}
            </Text>
         </View>

         <Text style={[sheet.text, { color: "#FFF" }]}>
            {data.main.temp_max.toFixed(0)}º
         </Text>
      </View>
   )
}

const sheet = StyleSheet.create({
   container: {
      flex: 1,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   text: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Lato",
      color: "#898989",
   },
   weatherWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 8,
   },
   weatherDescription: {
      fontSize: 16,
      flexShrink: 1,
      textTransform: "capitalize",
   },
   weatherIcon: {
      height: 28,
      width: 30,
      marginRight: 4
   },
})