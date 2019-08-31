module.exports = {
  dialect: 'postgres',
  host: '192.168.99.100',
  username: 'postgres',
  password: 'docker',
  database: 'meetapp',
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
  },
  dialectOptions: {
    useUTC: false,
    timezone: '-03:00',
  },
  timezone: '-03:00',
};
