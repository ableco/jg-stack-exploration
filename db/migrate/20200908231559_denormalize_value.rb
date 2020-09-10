class DenormalizeValue < ActiveRecord::Migration[6.0]
  def change
    add_column :investments, :value, :decimal, default: 0, null: false
    add_column :companies, :value, :decimal, default: 0, null: false
  end
end
