class CreateValuations < ActiveRecord::Migration[6.0]
  def change
    create_table :valuations do |t|
      t.decimal :amount
      t.references :investment, null: false, foreign_key: true
      t.date :date

      t.timestamps
    end
  end
end
