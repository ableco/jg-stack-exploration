class CreatePokemon < Struct.new(:force)
  JSON_HTTP = HTTP.headers(accept: "application/json")
  POKEMON_COUNT = 151

  def call
    return if skip_call?
    pokemons_list = fetch_pokemons_list
    pokemons_list.each do |pokemon_item|
      pokemon_data = JSON_HTTP.get(pokemon_item["url"]).parse
      create_pokemon_from_data(pokemon_data)
    end
  end

  private

  def skip_call?
    force || (Pokemon.count >= POKEMON_COUNT)
  end

  def fetch_pokemons_list
    JSON_HTTP.get("https://pokeapi.co/api/v2/pokemon?limit=#{POKEMON_COUNT}").parse["results"]
  end

  def create_pokemon_from_data(pokemon_data)
    name = pokemon_data["name"]
    number = pokemon_data["id"]
    image_url = pokemon_data["sprites"]["front_default"]
    puts "Creating pokemon #{number}/#{POKEMON_COUNT}: #{name}."
    Pokemon.create_with(
      number: number,
      image_url: image_url
    ).find_or_create_by(
      name: name
    )
  end
end

USERNAME = "ableuser"

User.create_with(password: "password").find_or_create_by(username: USERNAME)
CreatePokemon.new(ENV["FORCE_POKEMON_CREATION"].present?).call

