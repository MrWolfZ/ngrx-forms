
Any pull requests are welcome. For new features please check out and target the `develop` branch with your PR. For bugfixes check out and target the `master` branch. All PRs are validated via [Travis CI](https://travis-ci.org/MrWolfZ/ngrx-forms). Please ensure that all checks complete successfully.

To work on this library locally you can use the commands shown below.

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

- lints the code with _TSLint_
- compiles and bundles the library using TypeScript, the _ngc_ compiler, and rollup
- creates `dist` folder with all the files of distribution

To test the npm package locally run:

```Shell
npm run pack-lib
```

and install it in an app to test it with:

```Shell
npm install [path]ngrx-forms-[version].tgz
```

To build and install the library in the example application you can run this:

```Shell
npm run example-install
```

### Documentation
To generate the documentation, this library uses [mkdocs](http://www.mkdocs.org/). See their website on how to install it locally. Then you can view the documentation with:

```Shell
mkdocs serve
```