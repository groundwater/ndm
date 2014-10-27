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
  daemonsDirectory: process.env.HOME + '/lib',
  daemonExtension: '.json',
}

// Use /etc/redhat-release to determine if platform is NodeOS.
NodeOS.prototype.isPlatform = function() {
  return true
};

NodeOS.prototype.start = function(service, cb) {
  var self = this
  var str = service.daemonsDirectory + '/' + service.name + service.daemonExtension
  var job = fs.createReadStream(str, 'utf-8')

  var req = http.request({
    method : 'POST',
    path   : '/jobs/default',
    port   : 8080
  })

  req.on('response', function(res){
    if (res.statusCode === 200) {
      self.log('Started')
    } else {
      self.log('Failed')
    }

    res.pipe(process.stdout)

    cb()
  })

  req.on('error', function(err){
    console.error(err)
    cb(err)
  })

  job.pipe(req)
};

NodeOS.prototype.stop = function(service, cb) {
  // console.log(service)
  // service.execCommand('initctl stop ' + service.name, cb);

};

NodeOS.prototype.restart = function(service, cb) {
  // service.execCommand('initctl restart ' + service.name, cb);

};

module.exports = NodeOS;
