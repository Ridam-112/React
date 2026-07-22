const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude transient ox_tmp_* directories created during @clerk/expo installation.
// Metro's watcher tries to watch them after crawling but they are removed by then.
config.resolver.blockList = /[/\\]ox_tmp_[^/\\]+[/\\]/;

module.exports = config;
