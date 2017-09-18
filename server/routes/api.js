var express = require('express');
var router = express.Router();
var co = require('co');
var _ = require('underscore');
var npm  = require('../../services/npm');
var models  = require('../../models');
var NodeCache = require( "node-cache" );
var cache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );

router.get('/depend', function(req, res, next) {
  var name = req.query.name;
  var version = req.query.version;

  if (name == "" || name == undefined) {
    res.status(400);
    res.send({"error":"bad request"});
  }

  return co(function* () {

    var cached = false;

    if (version == undefined) {
      version = 'latest';
    }

    //try to get from cache
    var dependencies = cache.get(name+"@"+version);

    if (dependencies != undefined) {
      cached = true;
    }

    //try to get from db
    if (!dependencies){
      var obj = yield models.Package.findAll({
        where: {
          name: name,
          version: version
        },
        include : [{
          model: models.Dependency,
          as: 'dependencies'
        }]
      });
      if (obj.length == 1) {
        if (obj[0].dependencies.length > 0) {
          dependencies = _.map(obj[0].dependencies, function (e, i) {
            var el = {};
            el[e.name] = e.semver;
            return el;
          })
        }
      }
    }

    //try to get from npm API
    if (!dependencies){
      var depsAndVersionFromApi  = yield npm.getDependenciesAndVersion(name, version)
        .then(function(deps) {
          if (deps == undefined) return undefined;

          var dependencies = _.map(deps.dependencies, function(e, i){
            return {"name":i, "semver":e};
          });

          //save to db
          models.Package.create({
              name: name,
              version: deps.version,
              dependencies: dependencies
            },
            {
              include: [{
                model: models.Dependency,
                as: 'dependencies'
              }],
            })
            .catch(function(e){
              console.error(e);
            });


          return deps;
        })

      if (depsAndVersionFromApi != undefined) {
        console.log(depsAndVersionFromApi);
        dependencies = depsAndVersionFromApi.dependencies;
      }
    }


    if (dependencies != undefined) {
      if (!cached ) {
        //save to cache
        cache.set(name+"@"+version, dependencies);
      }
      res.send(dependencies);
      return;
    }
    else {
      res.status(404);
      res.send({"error":"not found"});
      return;
    }

  });
});

module.exports = router;
