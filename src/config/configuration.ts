export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'development',
  mongodburl: process.env.MONGODBURL,
  port: process.env.PORT || 3000,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES,
});
