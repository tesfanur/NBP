//configuration variables
module.exports = {
	// HTTP PORT
	PORT: process.env.PORT || 5000,
	// LOCAL DB CONNECTION URI
	AA_LRT_TICKETING_DB_URI : 'mongodb://127.0.0.1/AA_LRT_TICKETING_DB',
	PROD_MONGODB:"mongodb://tesfaye:mongolab@ds119688.mlab.com:19688/my_mongo_db_for_practice",
	JWT_SECRET: "shhh",
	TOKEN_LENGTH: 22,
	SECRET: 'TOKEN_SECRET',
	SALT_WORK_FACTOR:10
};
