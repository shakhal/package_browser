var request = require('request-promise');

exports.getDependenciesAndVersion = function(name, version) {
    if (version == undefined) {
        version = 'latest';
    }

    var options = {
        uri : 'https://registry.npmjs.org/' + name + '/' + version,
        json: true
    };

    return request(options)
        .then(function(res){
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
