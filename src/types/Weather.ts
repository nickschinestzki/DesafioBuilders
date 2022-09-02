
export type WeatherData = {
   weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: WeatherIcon;
   }>;
   name: string; // City's name
   main: {
      temp: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
   };
   wind: {
      speed: number; // received in m/s
   }
}

export type WeatherForecastData = WeatherData & { dt: number }

export type WeatherIcon = "01d" | "02d" | "03d" | "04d" | "09d" | "10d" | "11d" | "13d" | "50d" | "01n" | "02n" | "03n" | "04n" | "09n" | "10n" | "11n" | "13n" | "50n"

export type WeatherRequestParams = {
   lat: string;
   lon: string;
   appid: string;
   lang?: string;
   units?: "standard" | "metric" | "imperial";
}