namespace :users do
  desc "Clean up inactive users"
  task cleanup_inactive: :environment do
    puts "Starting inactive user cleanup..."

    inactive_days = ENV["INACTIVE_DAYS"]&.to_i

    result = InactiveUserCleanupService.cleanup(inactive_days: inactive_days)

    puts "Cleanup completed:"
    puts "  Inactive since: #{result[:inactive_since]}"
    puts "  Users found: #{result[:users_found]}"
    puts "  Users deleted: #{result[:users_deleted]}"
  end
end
