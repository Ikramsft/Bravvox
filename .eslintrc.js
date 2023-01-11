module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-native', 'prettier'],
  parser: '@typescript-eslint/parser',
  env: {
    'react-native/react-native': true,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'react/jsx-sort-props': [1, {callbacksLast: true, shorthandFirst: true, ignoreCase: true}],
    'react/react-in-jsx-scope': 0,
    'react-native/no-unused-styles': 1,
    'react-native/split-platform-components': 2,
    'react-native/no-inline-styles': 1,
    'react-native/no-color-literals': 1,
    'react-native/no-single-element-style-arrays': 2,
    'import/no-unresolved': 0,
    camelcase: 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'react/no-unescaped-entities': 0,
    'no-nested-ternary': 0,
    'default-param-last': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': [1, {extensions: ['.tsx']}],
    'prettier/prettier': 0,
    'no-use-before-define': 'off',
    'no-param-reassign': 0,
    'react/prop-types': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-use-before-define': 0,
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
  },
  settings: {
    react: {
      createClass: 'createReactClass', // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: 'React', // Pragma to use, default to "React"
      fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
      version: 'detect', // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // It will default to "latest" and warn if missing, and to "detect" in the future
      flowVersion: '0.53', // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      'forbidExtraProps',
      {property: 'freeze', object: 'Object'},
      {property: 'myFavoriteWrapper'},
      // for rules that check exact prop wrappers
      {property: 'forbidExtraProps', exact: true},
    ],
    componentWrapperFunctions: [
      // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
      'observer', // `property`
      {property: 'styled'}, // `object` is optional
      {property: 'observer', object: 'Mobx'},
      {property: 'observer', object: '<pragma>'}, // sets `object` to whatever value `settings.react.pragma` is set to
    ],
    formComponents: [
      // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
      'CustomForm',
      {name: 'Form', formAttribute: 'endpoint'},
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      'Hyperlink',
      {name: 'Link', linkAttribute: 'to'},
    ],
  },
};
