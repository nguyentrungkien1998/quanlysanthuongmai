/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/
    nuxt: (req, res) => {
      // Build in development
      return sails.config.nuxt.render(req, res);
    },
    
    order: [
     
      'cookieParser',
      'session',
      'bodyParser',
      'fileMiddleware',
      'compress',
      'poweredBy',
      'router',
      'nuxt',
      'www',
      'favicon',
    ],
    
    bodyParser: (function () {
      const bodyParser = require('body-parser');
      bodyParser.json({});
      bodyParser.urlencoded({limit:'100000mb', extended: true,parameterLimit: 1000000000 });
      return bodyParser();
    })(),
    
    fileMiddleware: (function () {
      const multer = require('multer');
      const upload = multer();
      upload.fields([{ name: 'file' }]);
      return upload.single('file');
    })(),
    

  },

};