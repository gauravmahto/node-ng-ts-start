import * as path from 'path';

global.projectRoot = path.resolve(__dirname);
global.clientSrc = path.resolve(global.projectRoot, '..', 'client');

// Path require base path.
require('app-module-path')
  .addPath(global.projectRoot);