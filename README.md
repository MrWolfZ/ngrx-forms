# ngrx-forms

Proper integration of forms in Angular 4 applications using ngrx.

Disclaimer: This library is not affiliated with the official ngrx library. I have created it mainly for my own use in one of my projects, but I thought others could profit as well.

Please note that this library is still very much work-in-progress and therefore there are many changes still being done. The library is also not yet available via npm. If you want to beta test it you can download the `ngrx-forms-[version].tgz` file from the example app and use that to install the library to your project via:

```Shell
npm install [path]ngrx-forms-[version].tgz --save
```

You can see the [example app](https://ngrx-forms-example-app.herokuapp.com/) online.

Until proper documentation exists I recommend having a look at the example app code to see how the library can be used.

### Open Points

- more ergenomic helper functions to modify form states (e.g. to disable, enable, update values etc.), especially for deeply nested states
- validation infrastructure (i.e. sync and async validators incl. validation status; although both are already achievable via reducer or effects)
- directive cleanup and tests (e.g. making certain status tracking like focus optional, having proper value conversion etc.)

## Contents
* [1 Testing](#1)
* [2 Building](#2)
* [3 Documentation](#3)
* [4 Using the library](#4)

## <a name="1"></a>1 Testing
The following command run unit & integration tests that are in the `tests` folder, and unit tests that are in `src` folder: 
```Shell
npm test 
```

## <a name="2"></a>2 Building
The following command:
```Shell
npm run build
```
- starts _TSLint_ with _Codelyzer_
- starts _AoT compilation_ using _ngc_ compiler
- creates `dist` folder with all the files of distribution

To test locally the npm package:
```Shell
npm run pack-lib
```
Then you can install it in an app to test it:
```Shell
npm install [path]ngrx-forms-[version].tgz
```

## <a name="3"></a>3 Documentation
To generate the documentation, this library uses [compodoc](https://github.com/compodoc/compodoc):
```Shell
npm run compodoc
npm run compodoc-serve 
```

## <a name="4"></a>4 Using the library
### Installing
```Shell
npm install ngrx-forms --save 
```
### Loading
#### Using SystemJS configuration
```JavaScript
System.config({
    map: {
        'ngrx-forms': 'node_modules/ngrx-forms/bundles/ngrx-forms.umd.js'
    }
});
```
#### Angular-CLI
No need to set up anything, just import it in your code.
#### Rollup or webpack
No need to set up anything, just import it in your code.
#### Plain JavaScript
Include the `umd` bundle in your `index.html`:
```Html
<script src="node_modules/ngrx-forms/bundles/ngrx-forms.umd.js"></script>
```
and use global `ng.myLibrary` namespace.

### AoT compilation
The library is compatible with _AoT compilation_.

## License
MIT
