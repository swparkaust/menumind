class Api::V1::UsersController < ApplicationController
  before_action :find_or_create_user, only: [:show, :update]

  def show
    render json: {
      uuid: @user.uuid,
      timezone: @user.timezone,
      preferences: @user.preferences
    }
  end

  def create
    user = User.new(user_params)
    user.timezone = params[:timezone] || 'Asia/Seoul'
    
    if user.save
      render json: { uuid: user.uuid }, status: :created
    else
      render json: { errors: user.errors }, status: :unprocessable_entity
    end
  end

  def update
    if @user.update(user_params)
      render json: { message: 'User updated successfully' }
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def destroy
    @user = User.find_by(uuid: params[:uuid])
    return render json: { error: 'User not found' }, status: :not_found unless @user

    @user.destroy
    render json: { message: 'All data cleared successfully' }
  end

  private

  def find_or_create_user
    @user = User.find_by(uuid: params[:uuid])
    return render json: { error: 'User not found' }, status: :not_found unless @user
  end

  def user_params
    params.permit(:timezone, :location_lat, :location_lng, preferences: {})
  end
end