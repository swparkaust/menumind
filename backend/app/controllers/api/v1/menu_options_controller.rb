class Api::V1::MenuOptionsController < ApplicationController
  def index
    lang = params[:lang] || 'ko'
    render json: MenuOptions.all_options(lang)
  end

  def food_types
    lang = params[:lang] || 'ko'
    render json: { food_types: MenuOptions.food_types(lang) }
  end

  def cuisine_types
    lang = params[:lang] || 'ko'
    render json: { cuisine_types: MenuOptions.cuisine_types(lang) }
  end

  def situations
    lang = params[:lang] || 'ko'
    render json: { situations: MenuOptions.situations(lang) }
  end
end