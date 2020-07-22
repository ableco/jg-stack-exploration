# Setup Process

## Create Rails App

```bash
$ rails new stack-test --database=postgresql --skip-sprockets --skip-turbolinks --skip-test --webpack=react
```

## Create basic route to serve application

```ruby
# new: app/controllers/home_controller.rb
class HomeController < ApplicationController
end

# in: config/routes.rb, inside: Rails.application.routes.draw
root to: "home#index"

# new: app/views/home/index.html.erb
<div id="root"></div>
```

### Configure Webpacker to use src

```bash
$ yarn add --dev unused-files-webpack-plugin
```

```bash
$ rm -rf app/javascript
```

```yaml
# in: config/webpacker.yml

## inside: development
check_yarn_integrity: false

## inside: default
source_path: src
```

```erb
<%# in: app/views/layouts/application.html.erb inside: head %>
<%= javascript_packs_with_chunks_tag "application" %>
<%= stylesheet_packs_with_chunks_tag "application" %>
```

```javascript
/* replace: config/webpack/environment.js */
const { environment } = require("@rails/webpacker");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");

const unusedFilesPlugin = new UnusedFilesWebpackPlugin({
  patterns: "src/**/*.{js,css}",
  globOptions: {
    ignore: [
      "node_modules/**/*",
      "**/*.test.js",
      "src/__tests__/*",
      "src/__mocks__/*",
      "coverage/**/*",
    ],
  },
});

environment.plugins.append("Unused Files", unusedFilesPlugin);

module.exports = environment;
```

```javascript
/* in: src/packs/application.js */
import React from "react";
import { render } from "react-dom";

document.addEventListener("DOMContentLoaded", () => {
  render(<h1>Hello World</h1>, document.getElementById("root"));
});
```

## Install React Router

```bash
$ yarn add react-router-dom@next history
```

## Setup React Router

```javascript
// replace: src/packs/application.js
import React from "react";
import { render } from "react-dom";
import App from "components/App";

document.addEventListener("DOMContentLoaded", () => {
  render(<App />, document.getElementById("root"));
});

// in: src/components/App/index.js
export { default } from "./App";

// in: components/App/App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "pages/LoginPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// in: src/pages/LoginPage/index.js
export { default } from "./LoginPage";

// in: src/pages/LoginPage/LoginPage.js
import React from "react";

function LoginPage() {
  return <h1>Login</h1>;
}

export default LoginPage;
```

### Install Tailwind

```bash
$ yarn add tailwindcss
```

```javascript
// in: postcss.config.js after: require("postcss-import"),
require("tailwindcss"),

// new: tailwind.config.js
module.exports = {
  purge: [],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};

// new: src/stylesheets/application.scss
@import "tailwindcss/base";
@import "tailwindcss/components";
@import "tailwindcss/utilities";
```

## Install Linters

```bash
$ yarn add eslint stylelint stylelint-prettier prettier @ableco/eslint-config eslint-import-resolver-webpack --save-dev
```

```javascript
// new: .eslintrc.js

const path = require("path");

module.exports = {
  root: true,
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve("./config/webpack/development"),
      },
      node: {
        paths: ["src"],
        extensions: [".js"],
      },
    },
    react: {
      version: "detect",
    },
  },
  extends: "@ableco",
  rules: {
    "unicorn/prefer-query-selector": "off",
  },
};

// new : .eslintignore

node_modules/
public/
tmp/
coverage/

// new: .stylelintrc

{
  "plugins": [
    "stylelint-prettier"
  ],
  "rules": {
    "prettier/prettier": true
  }
}

// new: .prettierignore

public/
coverage/
tmp/

// in: package.json inside: {root}
"scripts": {
    "prettify": "prettier --write \"**/*.{js,json,css}\"",
    "lint-js": "eslint \"**/*.js\"",
    "lint-css": "stylelint \"**/*.css\"",
    "lint": "yarn run lint-js && yarn run lint-css"
  },
```

## Basic Models

```bash
$ rails g model user username password_digest
$ rails g model pokemon number name image_url
$ rails g model chosen_pokemon pokemon:references user:references
```

```ruby
# replace: app/models/user.rb
class User < ApplicationRecord
  has_secure_password

  has_many :chosen_pokemons
end

# in: Gemfile, inside: root
gem "http"
gem "bcrypt"

# replace db/seeds.rb with contents on db/seeds.rb in this repo
```

## Before First Run

```bash
$ yarn run lint
$ rails db:create db:migrate db:seed
```
