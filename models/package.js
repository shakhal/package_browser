"use strict";

module.exports = function(sequelize, DataTypes) {
    var Package = sequelize.define("Package", {
        name: {type: DataTypes.STRING, unique: 'package_name_version' },
        version: {type: DataTypes.STRING, unique: 'package_name_version' },
    });


    Package.associate = function(models) {
        Package.hasMany(models.Dependency, {
            foreignKey: 'package_id',
            constraints: false,
            as: 'dependencies'
        })
    }

    return Package;
};