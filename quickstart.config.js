module.exports = {
  name: "project-condor",
  description: "Top secret work",
  client: "AIS",
  username: "cullenjett",
  origin: "",
  authors: ["The Condor"],
  bootstrap: "./src/main.js",
  timezone: "mountain",
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
        date: "6",
        type: "7",
        customerName: "8",
        customerEmail: "12",
        quickstart: {
          viewKey: "34",
          modifyKey: "35"
        }
      }
    }
  }
}