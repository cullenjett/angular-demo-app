'use strict';

let request = require('request')

module.exports = class ApiClient {
  constructor(config) {
    this.config = config
  }

  uploadPage(pageName, pageText) {
    let xmlData = `
      <pagebody>${this.handleXMLChars(pageText)}</pagebody>
      <pagetype>1</pagetype>
      <pagename>${pageName}</pagename>
    `

    return this.sendQbRequest('API_AddReplaceDBPage', xmlData)
  }

  uploadVariable(contents) {
    let varName = "quickstart_config"

    let xmlData = `
      <varname>${varName}</varname>
      <value>${this.handleXMLChars(contents)}</value>
    `

    return this.sendQbRequest('API_SetDBvar', xmlData)
  }

  // Private-ish

  handleXMLChars(string) {
    if (!string) {
      return
    }

    return string
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  sendQbRequest(action, data, mainAPICall) {
    let dbid = mainAPICall ? "main" : this.config.databaseId
    let url = `https://${this.config.realm}.quickbase.com/db/${dbid}?a=${action}`

    data = `
      <qdbapi>
        <username>${this.config.username}</username>
        <password>${this.config.password}</password>
        <hours>1</hours>
        <apptoken>${this.config.appToken}</apptoken>
        ${data}
      </qdbapi>
    `

    return new Promise((resolve, reject) => {
      request({
        url: url,
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/xml',
          'QUICKBASE-ACTION': action
        }
      }, (err, res, body) => {
        if (err) reject("ERROR:", err)

        let errCode = +body.match(/<errcode>(.*)<\/errcode>/)[1]
        if (errCode != 0) {
          reject(body)
        } else {
          resolve(body)
        }
      })
    })
  }
}