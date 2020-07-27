# Stack Test App

## Overall

This is a Pokemon Team Creator (one team of 6 pokemons) with many features to test some
technologies and how they behave together.

### Features

- Login
- Logout
- List of pokemons with an option to add them to your current team
- Sticky navbar always displaying your current team (max 6)
- Each pokemon should have its own page

### Basic Tech (not testing here)

- rails
- webpack
- yarn
- react
- react-router
- tailwind

### Setup Process

The setup process for this app is outlined here: [docs/setup.md].

## Tech to test

- Graphiti (replaced later with Graphql-Rails)
- Graphql-Rails

## Some Findings

### Graphiti

#### PROS

- More flexible than `jsonapi-resources` because it gives up control in the controller.
- Has an instrospection endpoint. Sadly, because it's not part of the standard, the only tool that can use it is one provided by the gem itself, which can only do queries, not mutate data.
- Can provide a json schema for the types of data.

#### CONS

- Documentation is really hard to grasp. There's not real code documentation, and the pages are more filled with bells and whistles than with actual explanation of what's going on.
- Resources in the controller don't have a clear way to access to the model. There are workaround for this but it doesn't make it less weird.
- There are features I'm not sure _even exist_ because the only way to research it was to look up in the repository code.

### Graphql

#### PROS

- Graphql schema is discoverable by querying the endpoint it with an introspection query. That's part of the standard, and so there are tools using the available queries and mutations in visualizations, autocompletion, linting, etc. None of this exist at all in JSON:API or restful apis.
- Graphql code organization is more free. Instead of endpoints for `create pokemon`, `create chosen-pokemon`, `destroy chosen-pokemon`, `create auth-token` and `destroy-auth-token`, we can have the following mutations: `create pokemon`, `add pokemon`, `remove pokemon`, `login` and `logout`. Mutation code not being limited to CRUD makes for a more readable code.
- Querying is more flexible but without adding too many rules, as in the case of JSON:API `includes`, `fields`, etc. Asking for what it would be `include` would be just nesting keys in a query, and the same goes for `fields`.
- Graphql ruby gem provides a very nice experience, with very very few surprises, which it's vastly different from what we can get from JSON:API gems. The only surprises where with Graphiql, the explorer that comes with the gem, being very underpowered, but there are many alternatives in the community, so that's not a problem. Also, the gem has a very good documentation.

#### CONS

- There's a challenge in organizing and abstracting mutations if CRUD is not the norm, but given discoverability, there's a high chance this is not as big as it would be without it.
- There's a paradigm shift that needs to be done in the backend.
- Caching in the backend is something that I don't have a clear idea of how to do it.
