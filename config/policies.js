/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/isLoggedIn.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "isLoggedIn")
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

 
module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/
   'member/*':['isLoggedIn','isAdmin'],
   'accountec/*':['isLoggedIn'],
   'product/*':['isLoggedIn'],
   'order/*':['isLoggedIn'],
   'user/*':['isLoggedIn'],
   'param/*':['isLoggedIn'],
   'category/*':['isLoggedIn'],
   'brand/*':['isLoggedIn'],
   'update/*':['isUpdate'],
   'trendproduct/*':['isLoggedIn'],
   'scanlink/*':['isLoggedIn'],
   'data/*':['isLoggedIn'],
   'edit/*':['isLoggedIn'],
   'optionform/*':['isLoggedIn'],
   'sold/*':['isLoggedIn'],
   'trendproductlink/*':['isLoggedIn'],
   'trendproductset/*':['isUpdate'],
   'up/*':['isLoggedIn'],
   'stock/*':['isLoggedIn'],
   'pending/*':['isLoggedIn'],
   'refreshec/*':['isLoggedIn'],
   'orderstatus/*':['isLoggedIn'],
   '*': true,

  
};
