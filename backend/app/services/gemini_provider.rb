class GeminiProvider < AiProviderBase
  include HTTParty
  base_uri "https://generativelanguage.googleapis.com"

  def initialize
    @api_key = ENV["GEMINI_API_KEY"]
    raise "GEMINI_API_KEY environment variable is required" unless @api_key
  end

  def generate_recommendation(context)
    prompt = build_recommendation_prompt(context)
    response = make_api_request(prompt)
    parse_recommendation_response(response)
  end

  def generate_greeting(user_context, food_type, cuisine, situation)
    prompt = build_greeting_prompt(user_context, food_type, cuisine, situation)
    response = make_api_request(prompt)
    parse_greeting_response(response)
  end

  def generate_insights(user_data)
    prompt = build_insights_prompt(user_data)
    response = make_api_request(prompt)
    parse_insights_response(response)
  end

  private

  def make_api_request(prompt)
    options = {
      headers: {
        "Content-Type" => "application/json"
      },
      body: {
        contents: [ {
          parts: [ {
            text: prompt
          } ]
        } ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      }.to_json
    }

    response = self.class.post("/v1beta/models/gemini-1.5-flash:generateContent?key=#{@api_key}", options)

    if response.success?
      response.parsed_response
    else
      raise "Gemini API error: #{response.code} - #{response.message}"
    end
  end

  def build_recommendation_prompt(context)
    # Process accepted and declined menus separately with full context
    accepted_menus = format_menu_recommendations(context[:recent_accepted_menus])
    declined_menus = format_menu_recommendations(context[:recent_declined_menus])

    # Get available options from centralized definitions
    food_types = MenuOptions.food_type_values.reject { |v| v == "all" }
    cuisine_types = MenuOptions.cuisine_type_values.reject { |v| v == "all" }
    situations = MenuOptions.situation_values.reject { |v| v == "all" }

    # Build dynamic content based on "all" values
    food_type_content = if context[:food_type] == "all"
      "음식 유형: 다음 중에서 가장 적합한 것을 선택해주세요 (#{food_types.join(', ')})"
    else
      "음식 유형: #{context[:food_type]}"
    end

    cuisine_type_content = if context[:cuisine_type] == "all"
      "요리 종류: 다음 중에서 가장 적합한 것을 선택해주세요 (#{cuisine_types.join(', ')})"
    else
      "요리 종류: #{context[:cuisine_type]}"
    end

    situation_content = if context[:situation] == "all"
      "상황: 다음 중에서 가장 적합한 것을 선택해주세요 (#{situations.join(', ')})"
    else
      "상황: #{context[:situation]}"
    end

    # Determine expert type
    expert_type = if context[:cuisine_type] == "all"
      "국제 음식 추천 전문가"
    else
      "#{context[:cuisine_type]} 음식 추천 전문가"
    end

    # Build response format
    response_format = {
      "menu_name" => "음식 이름",
      "description" => "간단한 설명 (2-3문장)"
    }

    # Add detected fields to response format if any parameter is "all"
    if context[:food_type] == "all"
      response_format["detected_food_type"] = "선택된 음식 유형 (#{food_types.join(', ')} 중 하나)"
    end

    if context[:cuisine_type] == "all"
      response_format["detected_cuisine_type"] = "선택된 요리 종류 (#{cuisine_types.join(', ')} 중 하나)"
    end

    if context[:situation] == "all"
      response_format["detected_situation"] = "선택된 상황 (#{situations.join(', ')} 중 하나)"
    end

    # Build menu history content
    menu_history_content = ""
    if accepted_menus.present?
      menu_history_content += "최근 7일 내에 수락한 메뉴들 (이런 스타일을 선호하지만 정확히 같은 메뉴는 추천하지 마세요):\n#{accepted_menus}\n"
    end
    if declined_menus.present?
      menu_history_content += "최근 7일 내에 거절한 메뉴들 (이런 것들은 제외해주세요):\n#{declined_menus}\n"
    end
    menu_history_content = menu_history_content.strip

    # Korean prompt for AI - user-facing content
    korean_requirements = build_korean_language_requirements
    specific_requirements = [
      "최근 수락한 메뉴와 정확히 같은 이름의 음식은 추천하지 마세요 (비슷한 스타일은 괜찮습니다)",
      "최근 수락한 메뉴의 요리 종류(cuisine_type)와 정확히 같은 요리 종류는 가능한 피해주세요 (다양성을 위해)"
    ]
    all_requirements = (korean_requirements + specific_requirements).map { |req| "- #{req}" }.join("\n      ")

    <<~PROMPT
      당신은 #{expert_type}입니다. 다음 정보를 바탕으로 한 가지 음식을 추천해주세요:

      현재 상황:
      #{format_context_info(context)}

      요청 정보:
      #{food_type_content}
      #{cuisine_type_content}
      #{situation_content}
      사용자 선호도: #{context[:user_preferences]}

      #{menu_history_content}

      중요한 요구사항:
      #{all_requirements}

      응답 형식:
      #{response_format.to_json}

      JSON 형태로만 응답해주세요.
    PROMPT
  end

  def build_greeting_prompt(context, food_type, cuisine, situation)
    # Korean prompt for AI - user-facing content
    korean_requirements = build_korean_language_requirements
    specific_requirements = [
      "따뜻하고 친근한 톤으로 1-2문장의 인사말을 작성해주세요",
      "구체적인 음식 이름이나 메뉴를 언급하지 마세요",
      "특정 음식을 추천하거나 제안하지 마세요",
      "일반적인 인사와 식사에 대한 관심 표현만 해주세요"
    ]
    all_requirements = (korean_requirements + specific_requirements).map { |req| "- #{req}" }.join("\n      ")

    <<~PROMPT
      사용자에게 개인화된 식사 인사말을 한국어로 작성해주세요.

      현재 상황:
      #{format_context_info(context)}

      요청 정보:
      - 음식 유형: #{food_type}
      - 요리 종류: #{cuisine}
      - 상황: #{situation}

      중요한 요구사항:
      #{all_requirements}

      응답 형식:
      {"greeting": "인사말 내용"}

      JSON 형태로만 응답해주세요.
    PROMPT
  end

  def build_insights_prompt(context)
    # Format full recommendation context for insights
    accepted_recommendations_detail = format_menu_recommendations(context[:accepted_recommendations])
    declined_recommendations_detail = format_menu_recommendations(context[:declined_recommendations])

    # Korean prompt for AI - user-facing content
    korean_requirements = build_korean_language_requirements
    specific_requirements = [
      "추천 시각, 날씨, 위치 정보도 분석에 활용해주세요",
      "3-5개의 인사이트를 제공해주세요",
      "구체적인 음식 이름이나 메뉴를 언급하지 마세요",
      "특정 음식을 추천하거나 제안하지 마세요",
      "음식 선택 패턴이나 취향의 경향성만 분석해주세요",
      "일반적인 식사 습관이나 선호도에 대한 통찰만 제공해주세요"
    ]
    all_requirements = (korean_requirements + specific_requirements).map { |req| "- #{req}" }.join("\n      ")

    <<~PROMPT
      사용자의 음식 선택 패턴을 분석하여 개인화된 인사이트를 제공해주세요.

      현재 상황:
      #{format_context_info(context)}

      사용자 데이터:
      - 수락한 추천: #{context[:accepted_recommendations].count}개
      - 수락한 메뉴 상세:
      #{accepted_recommendations_detail.present? ? accepted_recommendations_detail : '없음'}

      - 거절한 추천: #{context[:declined_recommendations].count}개
      - 거절한 메뉴 상세:
      #{declined_recommendations_detail.present? ? declined_recommendations_detail : '없음'}

      - 선호하는 음식 유형: #{context[:preferred_food_types]}
      - 선호하는 요리 종류: #{context[:preferred_cuisines]}
      - 선호하는 상황: #{context[:preferred_situations]}

      중요한 요구사항:
      #{all_requirements}

      응답 형식:
      {"insights": ["인사이트1", "인사이트2", ...]}

      JSON 형태로만 응답해주세요.
    PROMPT
  end

  def parse_recommendation_response(response)
    text = extract_text_from_response(response)

    # Remove code block markers if present
    cleaned_text = text.gsub(/```json\n/, "").gsub(/\n```/, "").strip

    parsed_response = JSON.parse(cleaned_text)

    # Validate detected fields against allowed values
    if parsed_response["detected_food_type"]
      unless MenuOptions.valid_food_type?(parsed_response["detected_food_type"])
        Rails.logger.warn "Invalid detected_food_type: #{parsed_response['detected_food_type']}"
        parsed_response.delete("detected_food_type")
      end
    end

    if parsed_response["detected_cuisine_type"]
      unless MenuOptions.valid_cuisine_type?(parsed_response["detected_cuisine_type"])
        Rails.logger.warn "Invalid detected_cuisine_type: #{parsed_response['detected_cuisine_type']}"
        parsed_response.delete("detected_cuisine_type")
      end
    end

    if parsed_response["detected_situation"]
      unless MenuOptions.valid_situation?(parsed_response["detected_situation"])
        Rails.logger.warn "Invalid detected_situation: #{parsed_response['detected_situation']}"
        parsed_response.delete("detected_situation")
      end
    end

    parsed_response
  rescue JSON::ParserError => e
    Rails.logger.error "JSON parsing failed: #{e.message} for text: #{text}"
    # Fallback response in Korean for user-facing content
    { "menu_name" => "김치찌개", "description" => "따뜻하고 맛있는 한국 전통 음식입니다." }
  end

  def parse_greeting_response(response)
    text = extract_text_from_response(response)
    # Remove code block markers if present
    cleaned_text = text.gsub(/```json\n/, "").gsub(/\n```/, "").strip
    JSON.parse(cleaned_text)
  rescue JSON::ParserError => e
    Rails.logger.error "JSON parsing failed for greeting: #{e.message} for text: #{text}"
    # Fallback greeting in Korean for user-facing content
    { "greeting" => "안녕하세요! 오늘은 어떤 음식을 드시고 싶으신가요?" }
  end

  def parse_insights_response(response)
    text = extract_text_from_response(response)
    # Remove code block markers if present
    cleaned_text = text.gsub(/```json\n/, "").gsub(/\n```/, "").strip
    JSON.parse(cleaned_text)
  rescue JSON::ParserError => e
    Rails.logger.error "JSON parsing failed for insights: #{e.message} for text: #{text}"
    # Fallback insights in Korean for user-facing content
    { "insights" => [ "다양한 음식을 시도해보시는군요!", "한국 음식을 선호하시는 것 같습니다." ] }
  end

  def extract_text_from_response(response)
    response.dig("candidates", 0, "content", "parts", 0, "text") || ""
  end

  def format_menu_recommendations(recommendations)
    return "" if recommendations.empty?

    recommendations.map do |r|
      context_info = ""
      if r.context.present?
        location_part = r.context["location"].present? ? ", 위치: #{r.context['location']}" : ""
        context_info = " (추천 시각: #{r.context['current_time']}, 날씨: #{r.context['weather']}#{location_part})"
      end
      "- #{r.menu_name} (#{r.cuisine_type}, #{r.food_type}, #{r.situation})#{context_info}"
    end.join("\n")
  end

  def build_korean_language_requirements
    [
      "모든 내용을 한국어로 작성해주세요",
      "영어 단어는 사용하지 마세요",
      "외국 음식명은 한국어로 표기해주세요 (예: \"Pad Thai\" → \"팟타이\", \"Fajitas\" → \"파히타\")",
      "외국 음식의 경우 한국어 음차 표기를 사용해주세요"
    ]
  end

  def format_context_info(context)
    [
      "현재 시간: #{context[:current_time]}",
      "날씨: #{context[:weather]}",
      "위치: #{context[:location]}"
    ].join("\n      ")
  end
end
