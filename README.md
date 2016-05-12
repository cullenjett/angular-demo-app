# QuickStart
**JavaScript QuickBase Portal**

QuickStart is a JavaScript single-page development environment to build and deploy QuickBase client-side portals. No external databases, servers to manage or Gemfiles to bundle.

## Start New QuickStart Project
* Create new repo on Github.
* Clone 'gulp-base' repo.
```shell
  git clone -b quickstart https://github.com/AdvantageIntegratedSolutions/gulp-base.git <NEW APP NAME>
```

***

* Update the git origin remote with your app's repo url.
```shell
  git remote set-url origin <new repo git url>
```
* run "npm install"

## QuickBase Application Setup
  * Roles
    * Create "Everyone on the internet" role, ensuring it has basic access with no view/modify permissions.
    * Create "QuickStart" role, ensuring it has basic access with View/Modify permissions to all tables that will be accessable by QuickStart users.
  * Users
    * Add "quickstart@advantagequickbase.com" as a "QuickStart" user to application.
  * Users Table
    * Create or utilize existing contacts table and add the following fields:
      * Email(if doesn't already exist) - (Email)
      * QuickStart - Last Accessed - (Date/Time)
      * QuickStart - Key - (Formula - Text)
        * This field controls permissions. Can be users email, users role, etc.
      * QuickStart - Password - (Text)
      * QuickStart - Restrict Access (Checkbox)
  * Other Tables
    * Create the following fields for all tables that will be accessible:
      * QuickStart - View Key - (Formula - Text)
        * All key values who can view this record.
        * Values must be comma separated values wrapped in single quotes.
        * '*' allows all portal users to view.
      * QuickStart - Modify Key (Formula - Text)
        * All key values who can modify this record.
        * Values must be comma separated values wrapped in single quotes.
        * '*' allows all portal users to modify.

## QuickStart Setup
* Complete configuration in app.json.

```js
{
  "name": "",
  "description": "",
  "client": "Advantage",
  "username": "", //quickbase username
  "origin": "", //git url
  "authors": [], //array of emails
  "bootstrap": "./src/main.js",
  "timezone": "", //timezone used in base
  "baseConfig": {
    "quickstart": "true", //always keep true
    "realm": "", //realm of quickbase application
    "token": "", //app token
    "async": "", //'callback' or 'promises'
    "databaseId": "", //main dbid
    "tables": {
      "table1": {
        "dbid": "", //table dbid
        "rid": "",
        "quickstart": {
          "username": "", //new 'QuickStart - Username' fid
          "password": "", //new 'QuickStart - Password' fid
          "key": "", //new 'QuickStart - Key' fid
          "name": "", //name fid(field with portal users name)
          "lastLoggedIn": "", //new 'QuickStart - Last Accessed' fid
          "restricted": "" //new 'QuickStart - Restrict' Access fid
        }
      },

      "table1": {
        "dbid": "",
        "rid": "",
        "quickstart": {
          "viewKey": "", //new 'QuickStart - View Key' fid
          "modifyKey": "" //new 'QuickStart - Modify Key' fid
        }
      }
    }
  }
}
```

## Deployment
Deploy to QuickBase with "gulp deploy".

Deploying will automatically compile src code, push to QuickBase, and replace local paths in index.html with their corrseponding QuickBase urls for the bundled css and js files. HTML files are all uploaded to QB separately, so if you are referencing them in your code you will need to update those references manually to reflect their QB urls (for now, stay tuned for an update here).

## Custom Domain
  * To setup custom domain:
    * Login to GoDaddy: https://dcc.godaddy.com/manage/advantagequickstart.com/dns
    * Scroll down to "Forwarding", under "Subdomain", click "Add".
      * Fill out subdomain with client name. (i.e. demo or ais)
      * Fill out forward to with QuickBase page url.
      * Change "Forward Only" to "Forward with masking".
      * Save.

=======
>>>>>>> 15516b39e00056b39a7678292e1a061433e76612
## Password Management
Set the "GULPPASSWORD" ENV variable to avoid committing password. Simply keep the password value empty in app.json or remove it.

```shell
  sudo vi ~/.bash_profile; export GULPPASSWORD=PASSWORD;
```

## Local Development
Start up a local server on "localhost:3000" with "gulp local" or "gulp watch".

Changes in the src directly will trigger an automatic live-reload of your browser.

## Css & JavaScript
Sass and ES6 are totally allowed (but not mandatory).

To include your compiled JS and CSS, include the following in your index.html file. This will work for both local devleopment and after deploying to QuickBase, as these paths are auto resolved to their corresponding QuickBase urls after running "gulp deploy".
```html
  <script src="https://s3.amazonaws.com/ais_libraries/BaseJS/4.7/base.min.js"></script>
  <script src="bundle.js"></script>
  <link rel="stylesheet" type="text/css" href="bundle.css">
```

###QUICKSTART_DoQuery
* same as [API_DoQuery](https://github.com/AdvantageIntegratedSolutions/base-js#api_doquery)

###QUICKSTART_AddRecord
* same as [API_AddRecord](https://github.com/AdvantageIntegratedSolutions/base-js#api_addrecord)

###QUICKSTART_EditRecord
* same as [API_EditRecord](https://github.com/AdvantageIntegratedSolutions/base-js#api_editrecord)

###QUICKSTART_PurgeRecords
* same as [API_PurgeRecords](https://github.com/AdvantageIntegratedSolutions/base-js#api_purgerecords)

## System Dependencies
* Node ^5.5.0

## Modules
gulp-base allows for either file concatenation or es6/requirejs modules via Browserify to compile your javascript files. To use Browserify give the "bootstrap" property in app.json the file path to the initialization javascript file for your app (the top of the .js file dependency tree). For straight concatentation simply leave the "bootstrap" property blank.

**Please be aware:** while you can bundle all dependencies using Browserify such as jQuery or underscore, the page editor in the QuickBase pages begins to become unresponsive if the code page is too large. Instead, try to use modules to include your own files and use script includes where possible so the browser can cache that nonsense.

## File Structure
All development has to be done inside the src/ directory, otherwise there are no enforced file structures. All files ending in .js will be run through Babel and Browserify (if applicable), and all .css, .scss, or .sass files will be complied with Sass and sent through autoprefixer before being concatenated into a bundle.css file.

```
+-- dist ( production distribution, pages uploaded to QB )
|   +-- bundle.css ( compiled styles for production )
|   +-- bundle.js ( compiled js for local )
|   +-- index.html ( compiled html for local )
+-- build
|   +-- tasks ( all gulp tasks )
|   +-- paths.js ( defines file paths for gulp to reference )
+-- node_modules ( gulp dependencies )
+-- src
|   +-- index.html ( duh )
+-- tmp
|   +-- bundle.css ( compiled styles for local )
|   +-- bundle.js ( compiled js for local )
|   +-- templates.js ( compiled templates/partials )
|   +-- index.html ( compiled html for local )
+-- app.json
+-- package.json
+-- gulpfile.js ( loads the tasks defined in build/tasks/ )
+-- README.md ( fresh readme for project )
```