class AddContextToMenuRecommendations < ActiveRecord::Migration[8.0]
  def change
    add_column :menu_recommendations, :context, :json
  end
end
