class Api::V1::RecommendationsController < ApplicationController
  before_action :find_user

  def index
    recommendations = @user.menu_recommendations.order(recommended_at: :desc).limit(20)
    render json: recommendations.map { |r| format_recommendation(r) }
  end

  def create
    recommendation = generate_recommendation
    render json: format_recommendation(recommendation)
  rescue StandardError => e
    render json: { error: "Failed to generate recommendation", details: e.message }, status: :internal_server_error
  end

  def respond
    recommendation = @user.menu_recommendations.find(params[:id])
    accept = params[:accept] == true || params[:accept] == "true"

    # Capture response context
    response_context = ::AiService.build_base_context(@user)
    recommendation.respond_to_recommendation(accept, response_context)

    if recommendation.declined?
      new_recommendation = generate_recommendation
      render json: {
        message: "New recommendation generated",
        recommendation: format_recommendation(new_recommendation)
      }
    else
      render json: { message: "Response recorded", recommendation: format_recommendation(recommendation) }
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Recommendation not found" }, status: :not_found
  rescue StandardError => e
    render json: { error: "Failed to generate new recommendation" }, status: :internal_server_error
  end

  def greeting
    params_hash = extract_recommendation_params

    begin
      greeting_response = ::AiService.generate_greeting(@user, **params_hash)
      render json: { greeting: greeting_response["greeting"] }
    rescue StandardError => e
      render json: { greeting: "안녕하세요! 오늘은 어떤 음식을 드시고 싶으신가요?" }
    end
  end

  def insights
    begin
      insights_response = ::AiService.generate_insights(@user)
      render json: { insights: insights_response["insights"] }
    rescue StandardError => e
      render json: { insights: [ "다양한 음식을 시도해보시는군요!" ] }
    end
  end

  private

  def find_user
    @user = User.find_by(uuid: params[:user_uuid])
    render json: { error: "User not found" }, status: :not_found unless @user
  end

  def format_recommendation(recommendation)
    {
      id: recommendation.id,
      menu_name: recommendation.menu_name,
      description: recommendation.description,
      food_type: recommendation.food_type,
      cuisine_type: recommendation.cuisine_type,
      situation: recommendation.situation,
      accepted: recommendation.accepted,
      declined: recommendation.declined,
      recommended_at: recommendation.recommended_at,
      responded_at: recommendation.responded_at,
      context: recommendation.context
    }
  end

  def extract_recommendation_params
    {
      food_type: params[:food_type] || "all",
      cuisine_type: params[:cuisine_type] || "all",
      situation: params[:situation] || "all"
    }
  end

  def generate_recommendation
    params_hash = extract_recommendation_params

    ai_response = ::AiService.generate_recommendation(@user, **params_hash)

    # Use detected values if available, otherwise use original parameters
    final_food_type = ai_response["detected_food_type"] || params_hash[:food_type]
    final_cuisine_type = ai_response["detected_cuisine_type"] || params_hash[:cuisine_type]
    final_situation = ai_response["detected_situation"] || params_hash[:situation]

    # Capture base context at the time of recommendation
    base_context = ::AiService.build_base_context(@user)

    @user.menu_recommendations.create!(
      menu_name: ai_response["menu_name"],
      description: ai_response["description"],
      food_type: final_food_type,
      cuisine_type: final_cuisine_type,
      situation: final_situation,
      context: base_context,
      recommended_at: Time.current
    )
  end
end
