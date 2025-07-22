class MenuRecommendation < ApplicationRecord
  belongs_to :user

  validates :menu_name, presence: true
  validates :food_type, presence: true, inclusion: { in: MenuOptions.food_type_values }
  validates :cuisine_type, presence: true, inclusion: { in: MenuOptions.cuisine_type_values }
  validates :situation, presence: true, inclusion: { in: MenuOptions.situation_values }
  validates :recommended_at, presence: true

  scope :accepted, -> { where(accepted: true) }
  scope :declined, -> { where(declined: true) }
  scope :pending, -> { where(accepted: false, declined: false) }
  scope :recent, -> { where("recommended_at > ?", 1.week.ago) }

  def respond_to_recommendation(accept, response_context = nil)
    update_attributes = {
      responded_at: Time.current
    }

    if accept
      update_attributes[:accepted] = true
    else
      update_attributes[:declined] = true
    end

    # Update context with response context if provided
    if response_context
      current_context = context || {}
      update_attributes[:context] = current_context.merge(response_context: response_context)
    end

    update!(update_attributes)
  end

  def responded?
    accepted? || declined?
  end
end
