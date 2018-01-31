//configuration variables
module.exports = {
	// HTTP PORT
	PORT: process.env.PORT || 8888,
	// LOCAL DB CONNECTION URI
	AA_LRT_TICKETING_DB_URI : 'mongodb://127.0.0.1/AA_LRT_TICKETING_DB',
	JWT_SECRET: "shhh",
	TOKEN_LENGTH: 22,
	SECRET: 'TOKEN_SECRET',
	SALT_WORK_FACTOR:10
};
