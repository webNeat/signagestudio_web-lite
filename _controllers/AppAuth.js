/**
 Manage user authentication and cookie creation
 @class AppAuth
 @constructor
 @return {Object} instantiated AppAuth
 **/
define(['jquery', 'backbone'], function ($, Backbone) {

    var AppAuth = Backbone.Controller.extend({

        /**
         Initiate user authentication against the Jalapeno db user credentials
         @method authenticate
         @param {String} i_user
         @param {String} i_pass
         **/
        authenticate: function (i_user, i_pass) {
            var self = this;
            var appRouter = Backbone.comBroker.getService(Services.LAYOUT_MANAGER);
            appRouter.navigate('authenticating', {trigger: true});

            // simulate slow db authentication so we show a loading screen
            setTimeout(function(){
                self._loadCredentials(i_user, i_pass);
            },3000);
        },

        /**
         Load user credentials from cookie if exists, else load from form data
         @method _loadCredentials
         @param {String} i_user
         @param {String} i_pass
         **/
        _loadCredentials: function () {
            Backbone.comBroker.getService(Services.LAYOUT_MANAGER).navigate('authenticated', {trigger: true});
        }

    });

    return AppAuth;
});


