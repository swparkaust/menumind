class User < ApplicationRecord
  has_many :menu_recommendations, dependent: :destroy
  has_many :user_preferences, dependent: :destroy
  has_many :ai_interactions, dependent: :destroy
  has_many :user_insights, dependent: :destroy

  validates :uuid, presence: true, uniqueness: true
  validates :timezone, presence: true

  before_validation :generate_uuid, on: :create

  scope :with_location, -> { where.not(location_lat: nil, location_lng: nil) }

  def recent_recommendations(limit = 10)
    menu_recommendations
      .where('recommended_at > ?', 1.week.ago)
      .order(recommended_at: :desc)
      .limit(limit)
  end

  def recent_accepted_menus(limit = 10)
    menu_recommendations
      .where('recommended_at > ? AND accepted = ?', 1.week.ago, true)
      .order(recommended_at: :desc)
      .limit(limit)
  end

  def recent_declined_menus(limit = 10)
    menu_recommendations
      .where('recommended_at > ? AND declined = ?', 1.week.ago, true)
      .order(recommended_at: :desc)
      .limit(limit)
  end

  def preferences
    user_preferences.order(preference_weight: :desc).first&.attributes&.slice(
      'food_type', 'cuisine_type', 'situation', 'preference_weight'
    )&.compact || {}
  end

  private

  def generate_uuid
    self.uuid = SecureRandom.uuid if uuid.blank?
  end
end
