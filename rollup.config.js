import resolve from 'rollup-plugin-node-resolve';

// Add here external dependencies that actually you use.
const globals = {
  '@angular/core': 'ng.core',
  '@angular/forms': 'ng.forms',
  '@ngrx/store': 'ngrx.store',
  'rxjs/Observable': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/operator/map': 'Rx',
  'rxjs/operator/distinctUntilChanged': 'Rx',
};

export default {
  entry: './dist/forms/@ngrx/forms.es5.js',
  dest: './dist/forms/bundles/forms.umd.js',
  format: 'umd',
  exports: 'named',
  moduleName: 'ngrx.forms',
  plugins: [resolve()],
  external: Object.keys(globals),
  globals: globals,
  onwarn: () => { return }
}
