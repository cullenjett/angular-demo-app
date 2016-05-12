module.exports = {
  name: "AISQuickStartCRM",
  description: "QuickStart demo application.",
  client: "AIS",
  username: "kith",
  origin: "",
  authors: ["khensel@advantagequickbase.com", "zsiglin@advantagequickbase.com"],
  bootstrap: "./src/main.js",
  timezone: "eastern",
  baseConfig: {
    quickstart: "true",
    realm: "ais",
    token: "",
    async: "callback",
    databaseId: "bkqdhycdy",
    tables: {
      customers: {
        dbid: "bkqdhyceg",
        rid: "3",
        quickstart: {
          username: "21",
          password: "38",
          key: "39",
          name: "42",
          lastLoggedIn: "40",
          restricted: "46"
        }
      },
      activities: {
        dbid: "bkqdhycek",
        rid: "3",
        type: "7",
        customerName: "8",
        date: "6",
        quickstart: {
          viewKey: "34",
          modifyKey: "35"
        }
      }
    }
  }
}