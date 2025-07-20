class WeatherService
  include HTTParty
  base_uri 'https://api.openweathermap.org'

  def self.get_weather(lat, lng)
    api_key = ENV['OPENWEATHER_API_KEY']
    return "Weather unavailable" unless api_key

    response = get("/data/2.5/weather", {
      query: {
        lat: lat,
        lon: lng,
        appid: api_key,
        units: 'metric',
        lang: 'kr'
      }
    })

    if response.success?
      weather_data = response.parsed_response
      temperature = weather_data.dig('main', 'temp')&.round
      description = weather_data.dig('weather', 0, 'description')
      
      "#{temperature}°C, #{description}"
    else
      "Weather unavailable"
    end
  rescue StandardError
    "Weather unavailable"
  end

  def self.get_location(lat, lng)
    api_key = ENV['OPENWEATHER_API_KEY']
    return "Location unavailable" unless api_key

    response = get("/geo/1.0/reverse", {
      query: {
        lat: lat,
        lon: lng,
        appid: api_key,
        limit: 1
      }
    })

    if response.success? && response.parsed_response.is_a?(Array) && response.parsed_response.any?
      location_data = response.parsed_response.first
      city = location_data['name']
      country = location_data['country']
      
      city.present? ? "#{city}, #{country}" : "Location unavailable"
    else
      "Location unavailable"
    end
  rescue StandardError
    "Location unavailable"
  end
end