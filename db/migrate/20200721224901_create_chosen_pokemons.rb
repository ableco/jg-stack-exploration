class CreateChosenPokemons < ActiveRecord::Migration[6.0]
  def change
    create_table :chosen_pokemons do |t|
      t.references :pokemon, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
