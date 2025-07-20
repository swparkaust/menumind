class CreateUserPreferences < ActiveRecord::Migration[8.0]
  def change
    create_table :user_preferences do |t|
      t.references :user, null: false, foreign_key: true
      t.string :food_type
      t.string :cuisine_type
      t.string :situation
      t.float :preference_weight

      t.timestamps
    end
  end
end
