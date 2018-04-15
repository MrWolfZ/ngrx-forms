const sorcery = require('sorcery');

const argv = require('yargs')
  .alias('f', 'file')
  .argv;

const chain = sorcery.loadSync(argv.file);
chain.write();
