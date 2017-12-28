/**
 * Copyright 2017 - Author gauravm.git@gmail.com
 */

import * as path from 'path';

global.projectRoot = path.resolve(__dirname);
global.clientSrc = path.resolve(global.projectRoot, '..', 'client');

// Path require base path.
require('app-module-path')  // tslint:disable-line
  .addPath(global.projectRoot);
