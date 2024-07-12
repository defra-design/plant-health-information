//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()
const versions = require('./versions.js')
const radioButtonRedirect = require('radio-button-redirect')
router.use(radioButtonRedirect)

// Add your routes here - above the module.exports line

require('./routes/v1.js')(router);
require('./routes/v2.js')(router);
require('./routes/v3.js')(router);
require('./routes/v4.js')(router);
require('./routes/v5.js')(router);
require('./routes/v6.js')(router);



// --------------------------------------------------------------


//inject the route data into the index page
router.get('/:version?', (req, res) => {

    //set the version to the latest
    let thisVersion = versions[versions.length -1].version

    //unless one is passed in
    if(req.params.version != undefined) {
      thisVersion = req.params.version
    }

    //load modules if they exists

    let pageObj = {
      version: thisVersion,
      versions: versions
    }


    res.render('index.html', pageObj)
  })

  //forward any `latest` url to most recent version
  router.all('/latest/:section/:page/:options?', (req, res) => {
    var redirectTo = `/${versions[versions.length -1]}/${req.params.section}/${req.params.page}`
    if(req.params.options != undefined) {
      redirectTo += `/${req.params.options}`
    }
    res.redirect(redirectTo)
  })

module.exports = router

