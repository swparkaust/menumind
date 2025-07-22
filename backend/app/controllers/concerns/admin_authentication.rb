module AdminAuthentication
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_admin
  end

  private

  def authenticate_admin
    user_uuid = params[:user_uuid] || params[:uuid]
    
    unless user_uuid
      render json: { error: "User identification required" }, status: :unauthorized
      return
    end

    user = User.find_by(uuid: user_uuid)
    unless user
      render json: { error: "User not found" }, status: :not_found
      return
    end

    unless user.is_admin?
      render json: { error: "Admin access required" }, status: :forbidden
      return
    end

    @current_admin = user
  end

  def current_admin
    @current_admin
  end
end