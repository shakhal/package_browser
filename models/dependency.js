"use strict";

module.exports = function(sequelize, DataTypes) {
    var Dependency = sequelize.define("Dependency", {
        name: DataTypes.STRING,
        semver: DataTypes.STRING,
        package_id: DataTypes.INTEGER
    });

    Dependency.associate = function(models) {
        Dependency.belongsTo(models.Package, {
            foreignKey: 'package_id',
            constraints: false
        })
    }

    return Dependency;
};