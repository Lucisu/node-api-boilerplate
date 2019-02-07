const Temporal = require('sequelize-temporal');
module.exports = (sequelize, Sequelize) => {
	const UserMeta = sequelize.define('users_meta', {
		id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      autoIncrement: false,
		},

		type: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		value: {
			type: Sequelize.STRING,
			allowNull: true,
		},
		status: {
			type: Sequelize.STRING,
			allowNull: true,
			defaultValue: "active"
		},
	},{
		underscored: true
	});
	Temporal(UserMeta, sequelize);
		UserMeta.associate = models => {
		UserMeta.belongsTo(models.users);
	};
	return UserMeta;
}
