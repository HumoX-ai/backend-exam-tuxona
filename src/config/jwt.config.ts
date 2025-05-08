export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '60m', // Token muddati 60 daqiqa
  },
};
