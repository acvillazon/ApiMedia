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

En resumen, We need to install
`eslint`
`prettier`
`eslint-plugin-node`
`eslint-plugin-prettier`
`eslint-config-prettier`
`eslint-config-node`
`eslint-config-airbnb`

Some configuration that you can put in your eslintrc is the next:
"extends": ["airbnb-base","prettier","plugin/node:recommended"],
"plugins": ["prettier"],
"parser": "babel-eslint",
"rules": {
"prettier/prettier": "error"
"no-unused-vars":"warm"
"no-console":"off"
"func-names":"off",
"no-process-exit":"off",
"class-methods-use-this":"off"
}
