class CreateInvestments < ActiveRecord::Migration[6.0]
  def change
    create_table :investments do |t|
      t.string :name
      t.decimal :invested
      t.string :optional_field
      t.date :expiration_date
      t.references :company, null: false, foreign_key: true

      t.timestamps
    end
  end
end
