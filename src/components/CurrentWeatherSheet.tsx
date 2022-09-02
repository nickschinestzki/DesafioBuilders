import React, { useEffect, useMemo, useRef, useState } from "react"
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated, Dimensions, Alert } from "react-native"

import { format } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import { getWeatherIcon } from "../utils"
import { OPEN_WEATHER_API_KEY } from "@env"
import { useTheme } from "../contexts/ThemeContext"
import { openWeatherAPI } from "../services/openWeather"
import { GeoPosition } from "react-native-geolocation-service"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { WeatherData, WeatherRequestParams } from "../types/Weather"
import { faArrowRotateRight, faDroplet, faLocationDot, faTemperatureHalf, faWind } from "@fortawesome/free-solid-svg-icons"

import { GradientText } from "./GradientText"
import LinearGradient from "react-native-linear-gradient"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"

interface CurrentWeatherSheetProps {
   position?: GeoPosition;
   onUpdateData: () => void;
}
export function CurrentWeatherSheet({ position, onUpdateData }: CurrentWeatherSheetProps) {
   const insets = useSafeAreaInsets()
   const [data, setData] = useState<WeatherData>()
   const { isNightTime, setIsNightTime } = useTheme()

   // Animations
   const contentAnimation = useRef(new Animated.Value(0)).current


   // When position is changed gets the current weather data
   useEffect(() => {
      // Hide content when loading
      animateContent("fadeOut")

      if (position)
         getCurrentWeatherData(position)
   }, [position])


   async function getCurrentWeatherData(position: GeoPosition) {
      try {
         const params: WeatherRequestParams = {
            lat: position.coords.latitude.toString(),
            lon: position.coords.longitude.toString(),
            units: "metric",
            lang: "pt_br",
            appid: OPEN_WEATHER_API_KEY,
         }
         const result = await openWeatherAPI.get("/weather", { params })
         setData(result.data as WeatherData)

         // If icon includes "n" that location is at night.
         setIsNightTime(!!result.data.weather[0].icon.includes("n"))

         // Shows content after weather data is loaded
         animateContent("fadeIn")

      } catch (error: any) {
         Alert.alert("Erro ao carregar dados do clima.")
      }
   }

   function animateContent(animation: "fadeIn" | "fadeOut") {
      Animated.timing(contentAnimation, {
         toValue: animation === "fadeIn" ? 1 : 0,
         useNativeDriver: true,
         duration: 500
      }).start()
   }

   const gradientColors = useMemo(() => {
      if (isNightTime)
         return ["#005C97", "#363795"]
      else
         return ["#37B7EC", '#1D6CF0']
   }, [isNightTime])

   return (
      <View style={[sheet.container, { shadowColor: isNightTime ? "#382996" : "#093B7C" }]}>
         <LinearGradient
            useAngle
            angle={200}
            style={[sheet.gradient, { paddingTop: insets.top }]}
            colors={gradientColors}
         >
            <Animated.View style={{ flex: 1, opacity: contentAnimation }}>
               <View style={sheet.header}>
                  <View style={{ width: 32 }} />
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <FontAwesomeIcon icon={faLocationDot} color="#FFF" size={14} />
                     <Text style={sheet.cityName}>
                        {data?.name}
                     </Text>
                  </View>
                  <TouchableOpacity style={sheet.refreshButton} onPress={onUpdateData}>
                     <FontAwesomeIcon icon={faArrowRotateRight} color="#000" size={20} />
                  </TouchableOpacity>
               </View>
               <Text style={sheet.todaysDate}>
                  {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
               </Text>
               <View style={sheet.temperatureWrapper}>
                  <GradientText
                     locations={[.3, 1]}
                     style={sheet.temperature}
                     colors={["#FFF", "#ffffff4f"]}
                  >
                     {data?.main.temp.toFixed(0)}
                  </GradientText>
                  <Text style={sheet.temperatureDegrees}>
                     º
                  </Text>
               </View>
               <Image
                  resizeMode="contain"
                  style={sheet.weatherIcon}
                  source={getWeatherIcon(data?.weather[0].icon)}
               />
               <Text style={sheet.weatherDescription}>
                  {data?.weather[0].description}
               </Text>
               <View style={sheet.infoWrapper}>
                  <View style={sheet.weatherInfo}>
                     <FontAwesomeIcon icon={faWind} color="#ffffffe5" size={20} />
                     <Text style={sheet.weatherInfoText}>
                        {data ? `${(data?.wind.speed * 3.6).toFixed(0)} km/h` : undefined}
                     </Text>
                     <Text style={[sheet.weatherInfoText, { marginTop: 0, color: "#ffffff99" }]}>
                        Ventos
                     </Text>
                  </View>
                  <View style={sheet.weatherInfo}>
                     <FontAwesomeIcon icon={faDroplet} color="#ffffffe5" size={20} />
                     <Text style={sheet.weatherInfoText}>
                        {data?.main.humidity}%
                     </Text>
                     <Text style={[sheet.weatherInfoText, { marginTop: 0, color: "#ffffff99" }]}>
                        Umidade
                     </Text>
                  </View>
                  <View style={sheet.weatherInfo}>
                     <FontAwesomeIcon icon={faTemperatureHalf} color="#ffffffe5" size={20} />
                     <Text style={sheet.weatherInfoText}>
                        {data?.main.temp_max.toFixed(0)}º{" "}
                        <Text style={{ color: '#ffffff99' }}>{data?.main.temp_min.toFixed(0)}º</Text>
                     </Text>
                     <Text style={[sheet.weatherInfoText, { marginTop: 0, color: "#ffffff99" }]}>
                        Máx. e Mín.
                     </Text>
                  </View>
               </View>
            </Animated.View>
         </LinearGradient>
      </View>

   )
}

const sheet = StyleSheet.create({
   container: {
      height: 600,
      width: Dimensions.get("window").width,
      borderBottomLeftRadius: 64,
      borderBottomRightRadius: 64,

      // Shadow
      shadowOffset: {
         width: 0,
         height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: 5,

      elevation: 10,
   },
   gradient: {
      width: "100%",
      height: "100%",
      paddingHorizontal: 32,

      borderBottomLeftRadius: 64,
      borderBottomRightRadius: 64,

   },
   header: {
      padding: 16,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#ffffff33",
   },
   cityName: {
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Lato",
      color: "#FFF",
      marginLeft: 4,
   },
   refreshButton: {
      width: 32,
      height: 32,
      borderRadius: 32,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FECE32"
   },
   todaysDate: {
      fontSize: 16,
      color: "#ffffffcc",
      fontWeight: "bold",
      textAlign: "center",
      fontFamily: "Lato",
      textTransform: "capitalize",
      marginTop: 24,
   },
   temperature: {
      fontSize: 180,
      fontWeight: "900",
      fontFamily: "Noto Sans",
      letterSpacing: -12,
      textAlignVertical: "center",
   },
   temperatureDegrees: {
      color: "#ffffffbe",
      fontSize: 80,
      fontWeight: "900",
      fontFamily: "Noto Sans",
      position: "absolute",
      right: -24,
      top: 40
   },
   temperatureWrapper: {
      marginTop: -40,
      position: "relative",
      alignSelf: "center",
   },
   weatherIcon: {
      overflow: "visible",
      marginTop: -100,
      height: 180,
      width: "auto",
      // Shadow
      shadowColor: "#000",
      shadowOffset: {
         width: 0,
         height: 20,
      },
      shadowOpacity: 0.2,
      shadowRadius: 15,

      elevation: 10,
   },
   weatherDescription: {
      fontSize: 24,
      color: "#FFF",
      fontFamily: "Lato",
      textAlign: "center",
      textTransform: "capitalize",
   },
   infoWrapper: {
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   weatherInfo: {
      marginTop: 24,
      alignItems: "center",
      flexDirection: "column",
   },
   weatherInfoText: {
      fontSize: 14,
      fontFamily: "Lato",
      color: "#ffffffe5",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: 8,
   }
})