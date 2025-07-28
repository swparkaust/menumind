class InactiveUserCleanupService
  DEFAULT_INACTIVE_DAYS = 90

  def self.cleanup(inactive_days: nil)
    new(inactive_days: inactive_days).cleanup
  end

  def self.status(inactive_days: nil)
    new(inactive_days: inactive_days).status
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

    # Store cleanup completion time in cache
    Rails.cache.write('last_inactive_user_cleanup_time', Time.current, expires_in: 1.year)

    {
      inactive_since: inactive_since,
      users_found: users_found_count,
      users_deleted: deleted_count
    }
  end

  def status
    inactive_since = @inactive_days.days.ago
    inactive_users = User.inactive_since(inactive_since)
    users_found_count = inactive_users.count.values.sum
    
    total_users = User.count
    last_cleanup = fetch_last_cleanup_time

    {
      total_users: total_users,
      inactive_threshold_days: @inactive_days,
      inactive_since: inactive_since,
      users_eligible_for_cleanup: users_found_count,
      last_cleanup_at: last_cleanup
    }
  end

  private

  def fetch_last_cleanup_time
    # Fetch from cache instead of log file
    Rails.cache.read('last_inactive_user_cleanup_time')
  end
end
