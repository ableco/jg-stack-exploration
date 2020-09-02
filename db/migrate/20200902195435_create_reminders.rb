class CreateReminders < ActiveRecord::Migration[6.0]
  def change
    create_table :reminders do |t|
      t.references :investment, null: false, foreign_key: true

      t.timestamps
    end
  end
end
