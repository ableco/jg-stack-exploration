class CreateChores < ActiveRecord::Migration[6.0]
  def change
    create_table :chores do |t|
      t.references :investment, null: false, foreign_key: true
      t.string :missing_field, null: false

      t.timestamps
    end
  end
end
