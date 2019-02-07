const Temporal = require('sequelize-temporal');
module.exports = (sequelize, Sequelize) => {
	const User = sequelize.define('user', {
		id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      autoIncrement: false,
		},
		photo: {
			type: Sequelize.STRING,
			allowNull: true,
	  },
		email: {
			type: Sequelize.STRING,
			allowNull: false,
	  },
	  first_name: {
			type: Sequelize.STRING,
			allowNull: false,
	  },
	  last_name: {
			type: Sequelize.STRING,
			allowNull: false,
	  },
	  address: {
		  type: Sequelize.STRING,
			allowNull: false,
	  },
		password: {
		  type: Sequelize.STRING,
			allowNull: false,
	  },
		token: {
		  type: Sequelize.STRING,
			allowNull: true
	  },
		password_recovery: {
			type: Sequelize.STRING,
			allowNull: true
		},
		password_recovery_time: {
			type: Sequelize.DATE,
			allowNull: true
		},
		roles: {
		  type: Sequelize.STRING,
			allowNull: false,
	  },

		last_access: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: Sequelize.NOW
		},
	},{
		underscored: true,
	}


);
User.prototype.show = function(){
	var values = Object.assign({}, this.get());

	delete values.password;
	delete values.password_recovery;
	delete values.password_recovery_time;
	return values;
 };
	Temporal(User, sequelize);
	return User;
}
