class CreateUserInsights < ActiveRecord::Migration[8.0]
  def change
    create_table :user_insights do |t|
      t.references :user, null: false, foreign_key: true
      t.string :insight_type
      t.json :insight_data
      t.datetime :generated_at

      t.timestamps
    end
  end
end
