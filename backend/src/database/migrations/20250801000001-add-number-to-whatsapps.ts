import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) =>
    queryInterface.addColumn("Whatsapps", "number", {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    }),

  down: (queryInterface: QueryInterface) =>
    queryInterface.removeColumn("Whatsapps", "number")
};
