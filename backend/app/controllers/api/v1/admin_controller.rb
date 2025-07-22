class Api::V1::AdminController < ApplicationController
  include AdminAuthentication

  def cleanup_status
    status = InactiveUserCleanupService.status
    render json: status
  end

  def cleanup_run
    result = InactiveUserCleanupService.cleanup
    render json: result
  end

  def verify
    render json: { is_admin: true, uuid: current_admin.uuid }
  end
end