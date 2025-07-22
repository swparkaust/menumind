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
    log_pattern = "Completed inactive user cleanup"
    log_file_path = Rails.root.join("log", "#{Rails.env}.log")
    
    return nil unless File.exist?(log_file_path)
    
    last_cleanup_line = nil
    File.foreach(log_file_path).reverse_each do |line|
      if line.include?(log_pattern)
        last_cleanup_line = line
        break
      end
    end
    
    return nil unless last_cleanup_line
    
    timestamp_match = last_cleanup_line.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)/)
    timestamp_match ? DateTime.parse(timestamp_match[1]) : nil
  rescue
    nil
  end
end
