var request = require('request-promise');

exports.getDependenciesAndVersion = function(name, version) {
    if (version == undefined) {
        version = 'latest';
    }

    if (name.startsWith('@')) {
      name = '@' + encodeURIComponent(name.substr(1));
      version = '';
    }

    var options = {
        uri : 'https://registry.npmjs.org/' + name + '/' + version,
        json: true,
        timeout: 20 * 1000
    };

    return request(options)
        .then(function(res){
          if(res.versions){
            res = res.versions[version];
          }

          return {
              dependencies: Object.assign({}, res.dependencies, res.devDependencies),
              version: res.version
          };
        })
        .catch(function (e) {
            console.log("caught in npm");
            return undefined;
        });
}
