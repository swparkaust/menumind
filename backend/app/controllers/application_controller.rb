class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity
  rescue_from StandardError, with: :render_internal_server_error

  private

  def render_not_found(exception)
    render json: { error: "Resource not found", details: exception.message }, status: :not_found
  end

  def render_unprocessable_entity(exception)
    render json: { error: "Validation failed", details: exception.record.errors }, status: :unprocessable_entity
  end

  def render_internal_server_error(exception)
    Rails.logger.error "Internal server error: #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n")

    render json: {
      error: "Internal server error",
      details: Rails.env.development? ? exception.message : "Something went wrong"
    }, status: :internal_server_error
  end
end
