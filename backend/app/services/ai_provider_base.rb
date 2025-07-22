class AiProviderBase
  def generate_recommendation(context)
    raise NotImplementedError, "Subclasses must implement generate_recommendation"
  end

  def generate_greeting(user_context, food_type, cuisine, situation)
    raise NotImplementedError, "Subclasses must implement generate_greeting"
  end

  def generate_insights(user_data)
    raise NotImplementedError, "Subclasses must implement generate_insights"
  end
end
