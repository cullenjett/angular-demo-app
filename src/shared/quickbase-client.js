var quickstart = require('../../quickstart.config.js');

const db = new Base(quickstart.baseConfig);

BaseHelpers.options.timeZone = quickstart.timezone;

export default db;