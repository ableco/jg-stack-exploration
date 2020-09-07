class ReminderResource < JSONAPI::Resource
  attributes :investment_id

  belongs_to :investment

  def self.default_sort
    [{ field: :updated_at, direction: :desc }]
  end
end
