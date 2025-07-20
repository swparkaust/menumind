class CreateAiInteractions < ActiveRecord::Migration[8.0]
  def change
    create_table :ai_interactions do |t|
      t.references :user, null: false, foreign_key: true
      t.text :prompt
      t.text :response
      t.json :context_data

      t.timestamps
    end
  end
end
