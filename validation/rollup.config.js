const resolve = require('rollup-plugin-node-resolve');

// Add here external dependencies that actually you use.
const globals = {
  'ngrx-forms': 'ngrx.forms',
};

module.exports = {
  entry: './dist/ngrx/forms/validation.es5.js',
  dest: './dist/bundles/forms-validation.umd.js',
  exports: 'named',
  plugins: [resolve()],
  external: Object.keys(globals),
  globals: globals,
  onwarn: () => { return }
}
