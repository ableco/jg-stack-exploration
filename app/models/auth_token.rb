class AuthToken < ApplicationRecord
  has_secure_token

  belongs_to :user

  validates :expires_at, presence: true

  scope :unexpired, -> { where("expires_at > ?", Time.now.utc) }

  before_validation :set_expiration_time

  def self.find_by_token(token)
    unexpired.find_by(token: token)
  end

  def set_expiration_time
    self.expires_at = Time.now.utc + 1.month
  end
end
