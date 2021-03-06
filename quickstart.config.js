module.exports = {
  name: "angular-demo-app",
  bootstrap: "./src/main.js",
  timezone: "mountain",
  baseConfig: {
    username: "cullenjett",
    password: process.env.GULPPASSWORD,
    realm: "ais",
    async: "callback",
    databaseId: "bkuvskxbm",
    token: "",
    tables: {
      users: {
        dbid: "bkuvskxhu",
        id: 3,
        name: 6,
        username: 7,
        relatedClient: 12,
        relatedClientName: 13,
        quickstart: {
          name: 6,
          username: 7,
          key: 8,
          password: 9,
          restricted: 10,
          lastLoggedIn: 11,
          viewKey: 20,
          modifyKey: 21
        }
      },
      attachments: {
        dbid: 'bkuvskycj',
        dateCreated: 1,
        id: 3,
        file: 6,
        description: 7,
        relatedRequest: 8,
        relatedClient: 13,
        relatedClientName: 14,
        relatedUser: 15,
        relatedUserName: 16,
        quickstart: {
          viewKey: 11,
          modifyKey: 12
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
      },
      comments: {
        dbid: 'bkuvskx9x',
        dateCreated: 1,
        id: 3,
        body: 6,
        relatedRequest: 7,
        relatedUser: 15,
        relatedUserName: 16,
        relatedUserUsername: 17,
        quickstart: {
          viewKey: 10,
          modifyKey: 11
        }
      },
      requests: {
        dbid: "bkuvskx6m",
        dateCreated: 1,
        dateModified: 2,
        id: 3,
        type: 6,
        description: 7,
        priority: 8,
        title: 9,
        status: 16,
        relatedUser: 17,
        relatedUserName: 18,
        relatedUserUsername: 19,
        relatedClient: 20,
        relatedClientName: 21,
        quickstart: {
          viewKey: 23,
          modifyKey: 24
        }
      }
    }
  }
}