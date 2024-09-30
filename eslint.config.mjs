export default [
  {
      rules: {
          "no-unused-vars": "warn",
          "no-undef": "error",
          "no-var":"error",
          "no-console":"warn"
      },
          ignores: [
              "!node_modules/",          
              "src/dist"
          ]
  }
];