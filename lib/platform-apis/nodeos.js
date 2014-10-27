// API for NodeOS Upstart 0.6.
var _ = require('lodash'),
  fs = require('fs'),
  http = require('http'),
  path = require('path'),
  PlatformBase = require('./platform-base').PlatformBase,
  util = require('util');

function NodeOS(opts) {
  _.extend(this, {
    platform: 'nodeos',
    releaseInfoFile: '/nodeos.md',
    template: path.resolve(__dirname, '../../templates/nodeos.ejs')
  }, opts);
}

util.inherits(NodeOS, PlatformBase);

// override default config variables.
NodeOS.configOverrides = {
  osLogsDirectory: '~/var/log',
  daemonsDirectory: '~/lib',
  daemonExtension: '.json',
}

// Use /etc/redhat-release to determine if platform is NodeOS.
NodeOS.prototype.isPlatform = function() {
  return true
};

NodeOS.prototype.start = function(service, cb) {
  // service.execCommand('initctl start ' + service.name, cb);
  service.execCommand('cat ~/lib/' + service.name + '.json', cb)
  cb()
};

NodeOS.prototype.stop = function(service, cb) {
  // service.execCommand('initctl stop ' + service.name, cb);

};

NodeOS.prototype.restart = function(service, cb) {
  // service.execCommand('initctl restart ' + service.name, cb);

};

module.exports = NodeOS;
