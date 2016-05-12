var config = require('../../../app.json')["baseConfig"];

const db = new Base(config);
export default db;