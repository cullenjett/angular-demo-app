var quickstart = require('../../quickstart.config.js');

const db = new Base(quickstart.baseConfig);
window.db = db;

BaseHelpers.options.timeZone = quickstart.timezone;

export default db;