const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Exclude transient ox_tmp_* directories created during @clerk/expo installation.
// Metro's FallbackWatcher tries to watch them after crawling, but they are removed
// by the time the watch call fires, producing a fatal ENOENT crash.
const { exclusionList } = require('metro-config');
config.resolver.blockList = exclusionList([/[/\\]ox_tmp_[^/\\]+[/\\]/]);

module.exports = config;
