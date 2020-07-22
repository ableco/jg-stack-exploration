class CreatePokemons < ActiveRecord::Migration[6.0]
  def change
    create_table :pokemons do |t|
      t.string :number
      t.string :name
      t.string :image_url

      t.timestamps
    end
  end
end
