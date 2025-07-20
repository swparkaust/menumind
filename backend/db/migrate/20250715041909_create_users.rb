class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :uuid, null: false
      t.string :timezone
      t.decimal :location_lat, precision: 10, scale: 6
      t.decimal :location_lng, precision: 10, scale: 6
      t.json :preferences, default: {}

      t.timestamps
    end

    add_index :users, :uuid, unique: true
  end
end
