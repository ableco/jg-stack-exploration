COMPANY_NAMES = %w(
  Microsoft Apple Amazon Google Facebook Visa Walmart NVIDIA Salesforce Adobe Netflix Disney Intel
  Coca-Cola AT&T Pepsi Toyota Nike Oracle McDonald's
)

def random_future_day
  rand(1..15).days.from_now
end

def random_past_day
  rand(1..365).days.ago
end

def random_amount
  rand(1400..7000)
end

def random_valuations_count
  rand(1..30)
end

User.create!(username: "testuser", password: "password")

COMPANY_NAMES.each do |name|
  company = Company.find_or_create_by!(name: name)

  investments_data = [
    ["Debt 1", random_amount, "chore-less", random_future_day],
    ["Debt 2", random_amount, nil, random_future_day],
    ["Series A", random_amount, nil, nil],
    ["Debt 3", random_amount, nil, random_future_day],
    ["Series B", random_amount, "chore-less", nil],
    ["Debt 4", random_amount, "chore-less", random_future_day]
  ]

  investments_data.each do |(name, invested, optional_field, expiration_date)|
    investment = Investment.find_or_create_by!(
      company_id: company.id,
      name: name
    )
    investment.update!(
      invested: invested,
      optional_field: optional_field,
      expiration_date: expiration_date
    )

    random_valuations_count.times do
      investment.valuations.create!(amount: random_amount, date: random_past_day)
    end
  end
end
