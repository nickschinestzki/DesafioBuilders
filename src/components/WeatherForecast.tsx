import React, { useCallback, useEffect, useState } from "react"
import { View, StyleSheet, Text } from "react-native"

import { OPEN_WEATHER_API_KEY } from "@env";
import { add, format, isBefore, isSameHour, isToday, set, startOfDay } from "date-fns";
import { openWeatherAPI } from "../services/openWeather";
import { GeoPosition } from "react-native-geolocation-service";
import { WeatherForecastData, WeatherRequestParams } from "../types/Weather";

import { FlatList } from "react-native-gesture-handler";
import { HourlyForecastItem } from "./HourlyForecastItem";
import { DailyForecastItem } from "./DailyForecastItem";
import SkeletonContent from "react-native-skeleton-content-nonexpo";

interface WeatherForecastProps {
   position?: GeoPosition;
}
export function WeatherForecast({ position }: WeatherForecastProps) {
   const [isLoading, setIsLoading] = useState(true)
   const [hourlyData, setHourlyData] = useState<WeatherForecastData[]>()
   const [nextDaysData, setNextDaysData] = useState<WeatherForecastData[]>()

   useEffect(() => {
      // Gets the hourly data when position's changed
      if (position)
         getForecastData(position)

   }, [position])

   async function getForecastData(position: GeoPosition) {
      // Shows skeleton loader
      setIsLoading(true)

      const params: WeatherRequestParams = {
         lat: position.coords.latitude.toString(),
         lon: position.coords.longitude.toString(),
         units: "metric",
         lang: "pt_br",
         appid: OPEN_WEATHER_API_KEY,
      }

      const result = await openWeatherAPI.get("/forecast", { params })
      const list = result.data.list as WeatherForecastData[]

      // Gets the start of tomorrow + 1 second so that
      // we can filter hourly data until midnight
      const startOfTomorrow = add(startOfDay(new Date()), { days: 1, seconds: 1 })

      // Filters hourly data from now until midnight (today)
      setHourlyData(list.filter(data => isBefore(new Date(data.dt * 1000), startOfTomorrow)))

      // Filters the daily weather (at 12:00 PM) for the next 5 days
      setNextDaysData(list.filter(data =>
         new Date(data.dt * 1000).getHours() === 12 && !isToday(new Date(data.dt * 1000))
      ))

      // Hides skeleton loader
      setIsLoading(false)
   }

   const renderHourlyItem = useCallback(({ item, index }: any) => {
      return (
         <HourlyForecastItem
            key={item.dt}
            data={item}
            isCurrentHour={index === 0}
         />
      )
   }, [])

   return (
      <View style={sheet.container}>
         <Text style={sheet.title}>
            Ao longo de hoje
         </Text>

         {isLoading ? (
            <SkeletonContent
               isLoading
               highlightColor="#606060"
               boneColor="#404040"
               containerStyle={sheet.hourlySkeletonContainer}
               layout={Array(4).fill(sheet.hourlySkeletonItem)}
            />
         ) : (
            <FlatList
               horizontal
               data={hourlyData}
               renderItem={renderHourlyItem}
               showsHorizontalScrollIndicator={false}
               contentContainerStyle={sheet.listContainer}
            />
         )}

         <Text style={sheet.title}>
            Nos próximos dias
         </Text>

         {isLoading ? (
            <SkeletonContent
               isLoading
               highlightColor="#606060"
               boneColor="#404040"
               containerStyle={sheet.dailySkeletonContainer}
               layout={Array(5).fill(sheet.dailySkeletonItem)}
            />
         ) : (
            <View style={{ marginTop: 8, marginHorizontal: 32, marginBottom: 120 }}>
               {nextDaysData?.map(data => (
                  <DailyForecastItem
                     key={data.dt}
                     data={data}
                  />
               ))}
            </View>
         )}
      </View>
   )
}

const sheet = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 24,
   },
   title: {
      fontSize: 20,
      color: "#FFF",
      fontWeight: "bold",
      fontFamily: "Lato",
      marginLeft: 32,
   },
   listContainer: {
      marginTop: 8,
      marginBottom: 24,
      marginLeft: 32,
      flexDirection: "row",
      alignItems: "center",
   },
   hourlySkeletonContainer: {
      marginTop: 8,
      marginBottom: 24,
      marginLeft: 32,
      flexDirection: "row",
      alignItems: "center",
   },
   hourlySkeletonItem: {
      height: 102,
      width: 72,
      borderRadius: 24,
      marginRight: 8,
   },

   dailySkeletonContainer: {
      marginTop: 8,
      marginBottom: 180,
      marginHorizontal: 32,
   },
   dailySkeletonItem: {
      flex: 1,
      height: 32,
      width: "100%",
      marginBottom: 8,
   },
})