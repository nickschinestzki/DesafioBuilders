import { WeatherIcon } from "./types/Weather";


export function getWeatherIcon(icon?: WeatherIcon) {
   switch (icon) {
      case "01d":
         return require("../assets/weather-icons/01d.png")
      case "01n":
         return require("../assets/weather-icons/01n.png")
      case "02d":
         return require("../assets/weather-icons/02d.png")
      case "02n":
         return require("../assets/weather-icons/02n.png")
      case "03d":
      case "03n":
      case "04d":
      case "04n":
         return require("../assets/weather-icons/03d.png")
      case "09d":
      case "09n":
         return require("../assets/weather-icons/09d.png")
      case "10d":
         return require("../assets/weather-icons/10d.png")
      case "10n":
         return require("../assets/weather-icons/10n.png")
      case "11d":
      case "11n":
         return require("../assets/weather-icons/11d.png")
      case "13d":
      case "13n":
         return require("../assets/weather-icons/13d.png")
      case "50d":
         return require("../assets/weather-icons/50d.png")
      case "50n":
         return require("../assets/weather-icons/50n.png")
   }
}