const Temporal = require('sequelize-temporal');
module.exports = (sequelize, Sequelize) => {
	const BannedUsers = sequelize.define('banned_users', {
		id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
		},
		reason: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		until_date: {
			type: Sequelize.DATE,
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
	// Temporal(BannedUsers, sequelize);
	BannedUsers.associate = models => {
		BannedUsers.belongsTo(models.users);	
	};
	return BannedUsers;
}
