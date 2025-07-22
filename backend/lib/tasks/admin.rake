namespace :admin do
  desc "Promote user to admin by UUID"
  task :promote, [:uuid] => :environment do |t, args|
    uuid = args[:uuid]
    
    unless uuid
      puts "Usage: rails admin:promote[USER_UUID]"
      exit 1
    end
    
    user = User.find_by(uuid: uuid)
    unless user
      puts "User not found with UUID: #{uuid}"
      exit 1
    end
    
    if user.is_admin?
      puts "User #{uuid} is already an admin"
      exit 0
    end
    
    user.update!(is_admin: true)
    puts "User #{uuid} promoted to admin successfully"
  end

  desc "Demote admin user"
  task :demote, [:uuid] => :environment do |t, args|
    uuid = args[:uuid]
    
    unless uuid
      puts "Usage: rails admin:demote[USER_UUID]"
      exit 1
    end
    
    user = User.find_by(uuid: uuid)
    unless user
      puts "User not found with UUID: #{uuid}"
      exit 1
    end
    
    unless user.is_admin?
      puts "User #{uuid} is not an admin"
      exit 0
    end
    
    user.update!(is_admin: false)
    puts "User #{uuid} demoted from admin successfully"
  end

  desc "List all admin users"
  task list: :environment do
    admins = User.admins
    if admins.empty?
      puts "No admin users found"
    else
      puts "Admin users:"
      admins.each { |admin| puts "- #{admin.uuid}" }
    end
  end
end