# APIMedia

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

author: `Andrés Villazón`

# Practice the use of ESlint and Prettier On Visual Code.

Basically, we need to install all the dependencies and plugins in our proyect.

- You can install ESlint writing the commeand `npm install eslint -D` but it is important you visit its official page [ESlint](https://eslint.org).

the next command help us to generate the config file.
`npx eslint --init`

- Next, We need to do the same with prettier, `npm install --D prettier`. You can see more in its page official [Prettier](https://prettier.io).

* It is recommended that we use the rules plugins of arb [Airbnb](https://www.npmjs.com/package/eslint-config-airbnb).

In resume, We need to install
`eslint`
`prettier`
`eslint-plugin-node`
`eslint-plugin-prettier`
`eslint-config-prettier`
`eslint-config-node`
`eslint-config-airbnb`
`bable-eslint`

Some configuration that you can put in your eslintrc is the next:

```json
"extends": ["airbnb-base","prettier","plugin/node:recommended"],
"plugins": ["prettier"],
"parser": "babel-eslint",
"rules": {
    "prettier/prettier": "error"
    "no-unused-vars": "warm"
    "no-console": "off"
    "func-names": "off"
    "no-process-exit": "off"
    "class-methods-use-this": "off"
}
```

We could do that VScode execute "Prettier" and "eslint" automatically as well.
For this we need to have to modify our settings.

```json
{
  ///////////////////
  "editor.formatOnSave": true, -> this line was added
  "window.zoomLevel": -1,
  "editor.fontSize": 14,
  "workbench.iconTheme": "material-icon-theme",
  "git.confirmSync": false,
  "files.associations": {
    "*.json": "json"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "workbench.colorTheme": "Community Material Theme Darker",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    ///////
    "editor.formatOnSave": true -> this line was added
  },
  ///////////
  "eslint.codeActionsOnSave.mode": "all", -> this line was added
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

```

```
