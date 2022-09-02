import React, { useEffect, useState } from "react"
import { StyleSheet, Alert, Linking, Platform, PermissionsAndroid } from "react-native"

import Geolocation, { GeoPosition } from "react-native-geolocation-service"

import { WeatherForecast } from "../components/WeatherForecast"
import { CurrentWeatherSheet } from "../components/CurrentWeatherSheet"
import { ScrollView } from "react-native-gesture-handler"

export function Homepage() {
   const [position, setPosition] = useState<GeoPosition>()

   // On page mounted request user's authorization to use device's location.
   useEffect(() => {

      if (Platform.OS === "ios") {
         Geolocation.requestAuthorization("whenInUse").then(authorization => {
            // If authorization is given, proceeds to collect geo position in
            // order to get the weather data
            if (["granted", "restricted"].includes(authorization)) {
               onUpdateData()
            } else {
               Alert.alert(
                  "É necessário o acesso à sua localização",
                  "Permita o acesso à localização nas configurações do aplicativo",
                  [{ onPress: Linking.openSettings, text: "Configurações" }]
               )
            }
         })
      } else {
         PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(status => {
               if (status !== "granted") {
                  Alert.alert(
                     "É necessário o acesso à sua localização",
                     "Permita o acesso à localização nas configurações do aplicativo",
                     [{ onPress: Linking.openSettings, text: "Configurações" }]
                  )
               } else onUpdateData()
            })
      }
   }, [])

   // In order to update the data, we get the device's current position again
   // which will trigger all functions that get weather data.
   function onUpdateData() {
      Geolocation.getCurrentPosition(
         (position) => setPosition(position),
         (error) => Alert.alert("Erro ao obter localização", error.message),
         { timeout: 15000, maximumAge: 10000 }
      )
   }

   return (
      <ScrollView
         style={sheet.container}
         showsVerticalScrollIndicator={false}
      >
         <CurrentWeatherSheet position={position} onUpdateData={onUpdateData} />

         <WeatherForecast position={position} />
      </ScrollView>
   )
}

const sheet = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#181818',
   },
})