'use strict'

const expect = require('chai').expect;
const mockery = require('mockery');
const fs = require('fs');
const bluebird = require('bluebird');
const response = require('../../npm.json');
const _ = require('underscore');

before(function (done) {

  // mockery.enable({
  //   warnOnReplace: false,
  //   warnOnUnregistered: false,
  //   useCleanCache: true
  // });
  //
  // mockery.registerMock('request-promise', function () {
  //   return bluebird.resolve(response);
  // });

  done();
});

after(function (done) {
  // mockery.disable();
  // mockery.deregisterAll();
  done();
});


describe('test response parsing', () => {
  describe('test', () => {
    it('should export a function', () => {
      mockery.enable({
        warnOnReplace: false,
        warnOnUnregistered: false,
        useCleanCache: true
      });

      mockery.registerMock('request-promise', function () {
        return bluebird.resolve(response);
      });


      const npm = require('../../services/npm');
      npm.getDependenciesAndVersion("name","version")
        .then(function(res){
          expect(res.version).to.equal(response.version);
          expect(Object.keys(res.dependencies)).to.deep.equal(Object.keys(response.dependencies).concat(Object.keys(response.devDependencies)));
        });

      mockery.disable();
      mockery.deregisterAll();

    })
  })
});

describe('test scoped package', () => {
  describe('test', () => {
    it('should return dependecies', () => {
      const npm = require('../../services/npm');
      return npm.getDependenciesAndVersion("@angular/http","4.4.3")
        .then(function(res){
          console.log("not mocked"+res);
          expect(res.version).to.equal("4.4.3");
        })
        .catch(function(err){
          console.log("error"+err);
        });
    })
  })
});

