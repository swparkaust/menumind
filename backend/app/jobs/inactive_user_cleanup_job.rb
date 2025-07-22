class InactiveUserCleanupJob < ApplicationJob
  queue_as :default

  def perform
    result = InactiveUserCleanupService.cleanup

    Rails.logger.info "InactiveUserCleanupJob completed: #{result.inspect}"
  end
end
