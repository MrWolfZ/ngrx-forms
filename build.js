"use strict";

const shell = require('shelljs');
const chalk = require('chalk');

const DIST_DIR = `dist`;
const MODULES_DIR = `${DIST_DIR}/@ngrx`;
const BUNDLES_DIR = `${DIST_DIR}/bundles`;

const PACKAGES = [
  {
    name: 'core',
    dir: '.',
    modulesDir: '.',
    bundleFileName: 'forms',
    moduleFileName: 'forms',
  },
  {
    name: 'validation',
    dir: './validation',
    modulesDir: 'forms',
    bundleFileName: 'forms-validation',
    moduleFileName: 'validation',
  },
];

shell.echo(`Cleaning output directory...`);
shell.rm(`-Rf`, `${DIST_DIR}/*`);
shell.mkdir(`-p`, `./${MODULES_DIR}`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);

for (var pkg of PACKAGES) {
  shell.echo(`Building package '${pkg.name}'...`);

  shell.echo(`Starting TSLint...`);
  if (shell.exec(`tslint -c tslint.json -t stylish --type-check --project . ${pkg.dir}/src/**/*.ts`).code !== 0) {
    shell.echo(chalk.red(`Error: TSLint failed`));
    shell.exit(1);
  }
  shell.echo(chalk.green(`TSLint completed!`));

  shell.echo(`Starting AoT compilation...`);
  if (shell.exec(`ngc -p ${pkg.dir}/tsconfig-build.json`).code !== 0) {
    shell.echo(chalk.red(`Error: AoT compilation failed!`));
    shell.exit(1);
  }

  shell.echo(chalk.green(`AoT compilation completed!`));

  shell.echo(`Starting bundling...`);
  if (shell.exec(`rollup -i ${DIST_DIR}/${pkg.dir}/${pkg.bundleFileName}.js -o ${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.js --sourcemap`, { silent: true }).code !== 0) {
    shell.echo(chalk.red(`Error: Bundling failed!`));
    shell.exit(1);
  }

  if (shell.exec(`node scripts/map-sources -f ${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Bundling failed!`));
    shell.exit(1);
  }

  shell.echo(`Downleveling ES2015 to ESM/ES5...`);
  shell.cp(`${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.js`, `${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.es5.ts`);

  // 2 indicates failure with output still being generated (this command will usually fail because of the --noLib flag)
  if (![0, 2].includes(shell.exec(`tsc ${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.es5.ts --target es5 --module es2015 --noLib --sourceMap`, { silent: true }).code)) {
    shell.echo(chalk.red(`Error: Downleveling failed!`));
    shell.exit(1);
  }

  if (shell.exec(`node scripts/map-sources -f ${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.es5.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Downleveling failed!`));
    shell.exit(1);
  }

  shell.rm(`-f`, `${MODULES_DIR}/${pkg.modulesDir}/${pkg.moduleFileName}.es5.ts`);

  shell.echo(`Running rollup conversion...`);
  if (shell.exec(`rollup -c ${pkg.dir}/rollup.config.js --sourcemap`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup conversion failed!`));
    shell.exit(1);
  }

  if (shell.exec(`node scripts/map-sources -f ${BUNDLES_DIR}/${pkg.bundleFileName}.umd.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Rollup conversion failed!`));
    shell.exit(1);
  }

  shell.echo(`Minifying...`);
  const pwd = shell.pwd();
  shell.pushd(BUNDLES_DIR);
  if (shell.exec(`${pwd}/node_modules/.bin/uglifyjs -c warnings=false --screw-ie8 --comments -o ${pkg.bundleFileName}.umd.min.js --source-map ${pkg.bundleFileName}.umd.min.js.map --source-map-include-sources ${pkg.bundleFileName}.umd.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Minifying failed!`));
    shell.exit(1);
  }

  if (shell.exec(`node ${pwd}/scripts/map-sources -f ${pkg.bundleFileName}.umd.min.js`).code !== 0) {
    shell.echo(chalk.red(`Error: Minifying failed!`));
    shell.exit(1);
  }

  shell.popd();

  shell.echo(chalk.green(`Bundling completed!`));

  shell.rm(`-Rf`, `${DIST_DIR}/${pkg.dir}/*.js`);
  shell.rm(`-Rf`, `${DIST_DIR}/${pkg.dir}/*.js.map`);
  shell.rm(`-Rf`, `${DIST_DIR}/${pkg.dir}/src/**/*.js`);
  shell.rm(`-Rf`, `${DIST_DIR}/${pkg.dir}/src/**/*.js.map`);

  shell.cp(`-Rf`, [`${pkg.dir}/package.json`], `${DIST_DIR}/${pkg.dir}`);

  if (pkg.name !== 'core') {
    shell.cp(`-Rf`, [`${pkg.dir}/${pkg.name}.d.ts`], DIST_DIR);
  }

  shell.echo(chalk.green(`Finished building package '${pkg.name}'!`));
}

shell.cp(`-Rf`, [`LICENSE`, `README.md`], `${DIST_DIR}`);

shell.echo(chalk.green(`Finished building!`));
