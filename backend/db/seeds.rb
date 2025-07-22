# Sample data for development and testing

if Rails.env.development?
  Rails.logger.info "Creating sample user..."

  # Create a sample user
  user = User.find_or_create_by(uuid: 'sample-user-uuid-123') do |u|
    u.timezone = 'Asia/Seoul'
    u.location_lat = 37.5665
    u.location_lng = 126.9780
    u.preferences = {
      'favorite_cuisines' => MenuOptions.cuisine_type_values.sample(2),
      'dietary_restrictions' => [],
      'spice_preference' => 'medium'
    }
  end

  Rails.logger.info "Creating sample recommendations..."

  # Create some sample recommendations
  sample_recommendations = [
    {
      menu_name: '김치찌개',
      description: '매콤하고 따뜻한 한국 전통 김치찌개입니다. 추운 날씨에 딱 맞는 음식이에요.',
      food_type: MenuOptions.food_type_values.reject { |v| v == 'all' }.sample,
      cuisine_type: 'Korean',
      situation: MenuOptions.situation_values.reject { |v| v == 'all' }.sample,
      accepted: true,
      recommended_at: 2.days.ago,
      responded_at: 2.days.ago
    },
    {
      menu_name: '라멘',
      description: '진한 국물과 쫄깃한 면발이 일품인 일본식 라멘입니다.',
      food_type: MenuOptions.food_type_values.reject { |v| v == 'all' }.sample,
      cuisine_type: 'Japanese',
      situation: MenuOptions.situation_values.reject { |v| v == 'all' }.sample,
      declined: true,
      recommended_at: 1.day.ago,
      responded_at: 1.day.ago
    },
    {
      menu_name: '불고기',
      description: '달콤한 양념에 재운 한국식 불고기입니다. 가족과 함께 드시기 좋아요.',
      food_type: MenuOptions.food_type_values.reject { |v| v == 'all' }.sample,
      cuisine_type: 'Korean',
      situation: MenuOptions.situation_values.reject { |v| v == 'all' }.sample,
      accepted: true,
      recommended_at: 12.hours.ago,
      responded_at: 12.hours.ago
    }
  ]

  sample_recommendations.each do |rec_data|
    user.menu_recommendations.find_or_create_by(
      menu_name: rec_data[:menu_name]
    ) do |rec|
      rec.assign_attributes(rec_data)
    end
  end

  Rails.logger.info "Creating sample insights..."

  # Create sample user insights
  user.user_insights.find_or_create_by(insight_type: 'preference_analysis') do |insight|
    insight.insight_data = {
      'top_cuisines' => MenuOptions.cuisine_type_values.reject { |v| v == 'all' }.sample(2),
      'preferred_situations' => MenuOptions.situation_values.reject { |v| v == 'all' }.sample(2),
      'acceptance_rate' => 0.67
    }
    insight.generated_at = Time.current
  end

  Rails.logger.info "Sample data created successfully!"
  Rails.logger.info "Sample user UUID: #{user.uuid}"
end
