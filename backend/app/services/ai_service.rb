class AiService
  def self.provider
    @provider ||= GeminiProvider.new
  end

  def self.generate_recommendation(user, food_type: 'all', cuisine_type: 'all', situation: 'all')
    context = build_recommendation_context(user, food_type, cuisine_type, situation)
    provider.generate_recommendation(context)
  end

  def self.generate_greeting(user, food_type: 'all', cuisine_type: 'all', situation: 'all')
    context = build_greeting_context(user)
    provider.generate_greeting(context, food_type, cuisine_type, situation)
  end

  def self.generate_insights(user)
    context = build_insights_context(user)
    provider.generate_insights(context)
  end

  def self.build_base_context(user)
    {
      current_time: Time.current.in_time_zone(user.timezone).strftime("%Y-%m-%d %H:%M %Z"),
      weather: fetch_weather(user),
      location: fetch_location(user)
    }
  end

  private

  def self.build_recommendation_context(user, food_type, cuisine_type, situation)
    build_base_context(user).merge(
      food_type: food_type,
      cuisine_type: cuisine_type,
      situation: situation,
      user_preferences: user.preferences,
      recent_accepted_menus: user.recent_accepted_menus(10),
      recent_declined_menus: user.recent_declined_menus(10)
    )
  end

  def self.build_greeting_context(user)
    build_base_context(user)
  end

  def self.build_insights_context(user)
    recommendations = user.menu_recommendations
    build_base_context(user).merge(
      accepted_recommendations: recommendations.accepted,
      declined_recommendations: recommendations.declined,
      preferred_food_types: extract_preferences(recommendations.accepted, :food_type),
      preferred_cuisines: extract_preferences(recommendations.accepted, :cuisine_type),
      preferred_situations: extract_preferences(recommendations.accepted, :situation)
    )
  end

  def self.extract_preferences(recommendations, attribute)
    recommendations.group(attribute).count.sort_by { |_, count| -count }.to_h
  end

  def self.fetch_weather(user)
    return "Weather unavailable" unless user.location_lat && user.location_lng

    WeatherService.get_weather(user.location_lat, user.location_lng)
  rescue StandardError
    "Weather unavailable"
  end

  def self.fetch_location(user)
    return "Location unavailable" unless user.location_lat && user.location_lng

    WeatherService.get_location(user.location_lat, user.location_lng)
  rescue StandardError
    "Location unavailable"
  end
end