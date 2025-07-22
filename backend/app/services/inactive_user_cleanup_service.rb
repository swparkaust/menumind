class InactiveUserCleanupService
  DEFAULT_INACTIVE_DAYS = 90

  def self.cleanup(inactive_days: nil)
    new(inactive_days: inactive_days).cleanup
  end

  def initialize(inactive_days: nil)
    @inactive_days = inactive_days || ENV.fetch("INACTIVE_USER_DAYS", DEFAULT_INACTIVE_DAYS).to_i
  end

  def cleanup
    inactive_since = @inactive_days.days.ago

    inactive_users = User.inactive_since(inactive_since)
    users_found_count = inactive_users.count.values.sum

    Rails.logger.info "Starting inactive user cleanup. Found #{users_found_count} users inactive since #{inactive_since}"

    deleted_count = 0

    inactive_users.find_each do |user|
      begin
        last_activity = user.last_activity_at
        Rails.logger.info "Deleting user #{user.uuid} (last activity: #{last_activity})"

        user.destroy!
        deleted_count += 1
      rescue => e
        Rails.logger.error "Failed to delete user #{user.uuid}: #{e.message}"
      end
    end

    Rails.logger.info "Completed inactive user cleanup. Deleted #{deleted_count} users"

    {
      inactive_since: inactive_since,
      users_found: users_found_count,
      users_deleted: deleted_count
    }
  end
end
