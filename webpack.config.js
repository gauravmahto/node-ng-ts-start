/**
 * Copyright 2018 - Author gauravm.git@gmail.com
 */

module.exports = (env, argv) => {
  if (env.production) {
    // Production
    return require('./configs/webpack.prod.config.js');
  } else {
    // Development and test
    return require('./configs/webpack.dev.config.js');
  }
};
