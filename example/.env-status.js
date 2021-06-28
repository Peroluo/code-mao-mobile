module.exports = {
  envs: ['local', 'staging', 'dev', 'dev01', 'test'],
  url: function (env) {
    return `http://localhost:4000/env-status.json`;
  },
  gen: 'build/env-status.json'
};