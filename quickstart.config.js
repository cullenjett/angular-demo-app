module.exports = {
  name: "project-condor",
  description: "Top secret work",
  client: "AIS",
  username: "cullenjett",
  origin: "https://github.com/AdvantageIntegratedSolutions/project-condor.git",
  authors: ["The Condor"],
  bootstrap: "./src/main.js",
  timezone: "mountain",
  baseConfig: {
    quickstart: "true",
    realm: "ais",
    async: "callback",
    databaseId: "bkuvskxbm",
    token: "",
    tables: {
      users: {
        dbid: "bkuvskxhu",
        id: 3,
        relatedClient: 12,
        relatedClientName: 13,
        quickstart: {
          name: 6,
          username: 7,
          key: 8,
          password: 9,
          restricted: 10,
          lastLoggedIn: 11
        }
      },
      clients: {
        dbid: "bkuvskxud",
        id: 3,
        name: 6,
        quickstart: {
          viewKey: 11,
          modifyKey: 12
        }
      }
    }
  }
}