class MenuOptions
  FOOD_TYPES = [
    { value: 'all', label_ko: '전체', label_en: 'All' },
    { value: 'meal', label_ko: '식사', label_en: 'Meal' },
    { value: 'dish', label_ko: '요리', label_en: 'Dish' },
    { value: 'snack', label_ko: '간식', label_en: 'Snack' }
  ].freeze

  CUISINE_TYPES = [
    { value: 'all', label_ko: '전체', label_en: 'All' },
    { value: 'Korean', label_ko: '한식', label_en: 'Korean' },
    { value: 'Chinese', label_ko: '중식', label_en: 'Chinese' },
    { value: 'Japanese', label_ko: '일식', label_en: 'Japanese' },
    { value: 'Italian', label_ko: '이탈리안', label_en: 'Italian' },
    { value: 'Asian', label_ko: '아시안', label_en: 'Asian' },
    { value: 'Mexican', label_ko: '멕시칸', label_en: 'Mexican' },
    { value: 'French', label_ko: '프랑스', label_en: 'French' },
    { value: 'Thai', label_ko: '태국', label_en: 'Thai' },
    { value: 'Indian', label_ko: '인도', label_en: 'Indian' },
    { value: 'Middle_Eastern', label_ko: '중동', label_en: 'Middle Eastern' },
    { value: 'American', label_ko: '미국', label_en: 'American' },
    { value: 'Mediterranean', label_ko: '지중해', label_en: 'Mediterranean' }
  ].freeze

  SITUATIONS = [
    { value: 'all', label_ko: '전체', label_en: 'All' },
    { value: 'solo dining', label_ko: '혼자 식사', label_en: 'Solo Dining' },
    { value: 'family dinner', label_ko: '가족 식사', label_en: 'Family Dinner' },
    { value: 'casual outing', label_ko: '일상적 외식', label_en: 'Casual Outing' },
    { value: 'date', label_ko: '데이트', label_en: 'Date' },
    { value: 'group gathering', label_ko: '모임', label_en: 'Group Gathering' }
  ].freeze

  class << self
    def food_types(lang = 'ko')
      format_options(FOOD_TYPES, lang)
    end

    def cuisine_types(lang = 'ko')
      format_options(CUISINE_TYPES, lang)
    end

    def situations(lang = 'ko')
      format_options(SITUATIONS, lang)
    end

    def food_type_values
      FOOD_TYPES.map { |option| option[:value] }
    end

    def cuisine_type_values
      CUISINE_TYPES.map { |option| option[:value] }
    end

    def situation_values
      SITUATIONS.map { |option| option[:value] }
    end

    def valid_food_type?(value)
      food_type_values.include?(value)
    end

    def valid_cuisine_type?(value)
      cuisine_type_values.include?(value)
    end

    def valid_situation?(value)
      situation_values.include?(value)
    end

    def all_options(lang = 'ko')
      {
        food_types: food_types(lang),
        cuisine_types: cuisine_types(lang),
        situations: situations(lang)
      }
    end

    private

    def format_options(options, lang)
      label_key = lang == 'en' ? :label_en : :label_ko
      options.map do |option|
        {
          value: option[:value],
          label: option[label_key]
        }
      end
    end
  end
end