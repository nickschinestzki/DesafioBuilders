import axios from "axios"

export const openWeatherAPI = axios.create({
   baseURL: "https://api.openweathermap.org/data/2.5",
})