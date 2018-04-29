
Any pull requests are welcome. If you want to work on this library locally you can use the commands shown below.

### Testing
The following command runs all unit tests:
```Shell
npm test
```

### Building and Packaging
The following command:
```Shell
npm run build
```
- starts _TSLint_ with _Codelyzer_
- starts _AoT compilation_ using _ngc_ compiler
- creates `dist` folder with all the files of distribution

To test the npm package locally run:
```Shell
npm run pack-lib
```
and install it in an app to test it with:
```Shell
npm install [path]ngrx-forms-[version].tgz
```

<!--
### Documentation
To generate the documentation, this library uses [compodoc](https://github.com/compodoc/compodoc):
```Shell
npm run compodoc
npm run compodoc-serve
```
-->