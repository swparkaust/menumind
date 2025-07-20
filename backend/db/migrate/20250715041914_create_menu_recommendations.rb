class CreateMenuRecommendations < ActiveRecord::Migration[8.0]
  def change
    create_table :menu_recommendations do |t|
      t.references :user, null: false, foreign_key: true
      t.string :menu_name, null: false
      t.text :description
      t.string :food_type, null: false
      t.string :cuisine_type, null: false
      t.string :situation, null: false
      t.boolean :accepted, default: false
      t.boolean :declined, default: false
      t.datetime :recommended_at, null: false
      t.datetime :responded_at

      t.timestamps
    end

    add_index :menu_recommendations, [:user_id, :recommended_at]
    add_index :menu_recommendations, :menu_name
  end
end
