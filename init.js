/**
 Require js initialization module definition file
 @class Require init.js
 **/
require.config({
    baseUrl: '/_studiolite-dev/',
    paths: {
        "jquery": '_common/_jquery/std/jq1.9.1/jquery-1.9.1',
        "backbone": '_common/_js/backbone/backbone',
        "backbone.controller": '_common/_js/backbone-controller/backbone.controller',
        "underscore": '_common/_js/underscore/underscore',
        "bootstrap": '_common/_js/bootstrap/js/bootstrap',
        "bootbox": '_common/_js/bootbox/bootbox',
        "Cookie": '_common/_js/cookie/jquery.cookie',
        "Base64": '_common/_js/base64/jquery.base64',
        "Services": 'Services',
        "Elements": 'Elements',
        "LayoutManager": '_comps/LayoutManager',
        "ComBroker": '_controllers/ComBroker',
        "AppAuth": '_controllers/AppAuth',
        "AppSizer": '_controllers/AppSizer',
        "StackView": '_views/StackView',
        "NavigationView": '_views/NavigationView',
        "WaitView": '_views/WaitView',
        "AppContentFaderView": '_views/AppContentFaderView',
        "AppEntryFaderView": '_views/AppEntryFaderView',
        "LoginView": '_views/LoginView',
        "ResourcesView": '_views/ResourcesView',
        "StationsView": '_views/StationsView',
        "SettingsView": '_views/SettingsView',
        "ProStudioView": '_views/ProStudioView',
        "HelpView": '_views/HelpView',
        "LogoutView": '_views/LogoutView',
        "CampaignManagerView": '_views/CampaignManagerView',
        "CampaignSliderView": '_views/CampaignSliderView',
        "CampaignSelectorView": '_views/CampaignSelectorView',
        "ResolutionSelectorView": '_views/ResolutionSelectorView',
        "OrientationSelectorView": '_views/OrientationSelectorView',
        "CampaignView": '_views/CampaignView',
        "PopModalView": '_views/PopModalView',
        "Lib": '_comps/Lib'
    },


    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.controller': {
            deps: ['underscore', 'jquery']
        },
        "LayoutManager": {
            deps: ["Elements", "backbone.controller"]
        },
        "Lib": {
            deps: ['backbone', "jquery"]
        },
        'sdk': {
            exports: 'sdk'
        },
        'underscore': {
            exports: '_'
        },
        "bootstrap": {
            deps: ["jquery"]
        },
        "bootbox": {
            deps: ["jquery"],
            exports: 'bootbox'
        },
        "Services": {
            exports: 'Services'
        },
        "Elements": {
            exports: 'Elements'
        },
        "ComBroker": {
            deps: ["backbone", "jquery"]
        }
    }
});

require(['StudioLite'],function(StudioLite){
    new StudioLite();
});