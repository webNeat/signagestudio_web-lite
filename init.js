/**
 Require js initialization module definition file for StudioLite
 @class Require init js
 **/
require.config({
    waitSeconds: 25,
    baseUrl: '/_studiolite-dev/',
    paths: {
        'jquery': '_common/_jquery/std/jq1.9.1/jquery-1.9.1',
        'jqueryui': '_common/_jquery/std/jq1.10.1/jquery-ui-1.10.1',
        'backbone': '_common/_js/backbone/backbone',
        'backbone.controller': '_common/_js/backbone-controller/backbone.controller',
        'underscore': '_common/_js/underscore/underscore',
        'bootstrap': '_common/_js/bootstrap/js/bootstrap',
        'fabric': '_common/_js/fabric/fabric.require',
        'bootbox': '_common/_js/bootbox/bootbox',
        'Cookie': '_common/_js/cookie/jquery.cookie',
        'gradient': '_common/_js/gradient/jquery.gradientPicker',
        'minicolors': '_common/_js/minicolors/jquery.minicolors',
        'colorpicker': '_common/_js/gradient/colorpicker',
        'RC4': '_common/_js/rc4/RC4',
        'localizer': '_common/_js/localizer/dist/jquery.localize',
        'spinner': '_common/_js/fuelux/src/spinner',
        'simplestorage': '_common/_js/simplestorage/simpleStorage',
        'nouislider': '_common/_js/nouislider/jquery.nouislider',
        'XDate': '_common/_js/xdate/xdate',
        'Base64': '_common/_js/base64/jquery.base64',
        'Knob': '_common/_js/knob/jquery.knob',
        'TouchPunch': '_common/_js/touchpunch/TouchPunch',
        'X2JS': '_common/_js/x2js/xml2json',
        'Elements': 'Elements',
        'LayoutRouter': '_controllers/LayoutRouter',
        'ComBroker': '_controllers/ComBroker',
        'ScreenTemplateFactory': '_controllers/ScreenTemplateFactory',
        'BlockFactory': '_controllers/BlockFactory',
        'AppAuth': '_controllers/AppAuth',
        'AjaxRPC': '_controllers/AjaxRPC',
        'AjaxJsonGetter': '_controllers/AjaxJsonGetter',
        'Timeline': '_controllers/Timeline',
        'Channel': '_controllers/Channel',
        'Block': '_controllers/_blocks/Block',
        'BlockRSS': '_controllers/_blocks/BlockRSS',
        'BlockQR': '_controllers/_blocks/BlockQR',
        'BlockVideo': '_controllers/_blocks/BlockVideo',
        'BlockImage': '_controllers/_blocks/BlockImage',
        'BlockExtImage': '_controllers/_blocks/BlockExtImage',
        'BlockExtVideo': '_controllers/_blocks/BlockExtVideo',
        'BlockClock': '_controllers/_blocks/BlockClock',
        'BlockHTML': '_controllers/_blocks/BlockHTML',
        'BlockLabel': '_controllers/_blocks/BlockLabel',
        'BlockMRSS': '_controllers/_blocks/BlockMRSS',
        'StackView': '_views/StackView',
        'NavigationView': '_views/NavigationView',
        'WaitView': '_views/WaitView',
        'ResourcesView': '_views/ResourcesView',
        'SceneEditorView': 'SceneEditorView',
        'ResourceListView': '_views/ResourceListView',
        'AddBlockView': '_views/AddBlockView',
        'BlockProperties': '_views/BlockProperties',
        'FontSelector': '_views/FontSelector',
        'DimensionProps': '_views/DimensionProps',
        'AppContentFaderView': '_views/AppContentFaderView',
        'AppEntryFaderView': '_views/AppEntryFaderView',
        'LoginView': '_views/LoginView',
        'StationsViewLoader': '_views/StationsViewLoader',
        'StationsListView': '_views/StationsListView',
        'SettingsView': '_views/SettingsView',
        'ProStudioView': '_views/ProStudioView',
        'HelpView': '_views/HelpView',
        'LogoutView': '_views/LogoutView',
        'PropertiesView': '_views/PropertiesView',
        'CampaignManagerView': '_views/CampaignManagerView',
        'CampaignSliderStackView': '_views/CampaignSliderStackView',
        'CampaignSelectorView': '_views/CampaignSelectorView',
        'CampaignNameSelectorView': '_views/CampaignNameSelectorView',
        'ResolutionSelectorView': '_views/ResolutionSelectorView',
        'OrientationSelectorView': '_views/OrientationSelectorView',
        'ScreenLayoutSelectorView': '_views/ScreenLayoutSelectorView',
        'ScreenLayoutEditorView': '_views/ScreenLayoutEditorView',
        'LanguageSelectorView': '_views/LanguageSelectorView',
        'CampaignView': '_views/CampaignView',
        'SequencerView': '_views/SequencerView',
        'ChannelListView': '_views/ChannelListView',
        'PopModalView': '_views/PopModalView',
        'RSSLinks': '_views/RSSLinks',
        'MRSSLinks': '_views/MRSSLinks',
        'StationsCollection': '_collections/StationsCollection',
        'StationModel': '_models/StationModel',
        'Lib': '_libs/Lib',
        'ScreenTemplate': '_libs/ScreenTemplate',
        'Pepper': '_libs/Pepper',
        'PepperHelper': '_libs/PepperHelper',
        'Fonts': '_libs/Fonts'
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone.controller': {
            deps: ['underscore', 'jquery']
        },
        'LayoutRouter': {
            deps: ['Elements', 'backbone.controller']
        },
        'Lib': {
            deps: ['backbone', 'jquery']
        },
        'sdk': {
            exports: 'sdk'
        },
        'underscore': {
            exports: '_'
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootbox': {
            deps: ['jquery'],
            exports: 'bootbox'
        },
        'AppAuth': {
            deps: ['RC4', 'Cookie']
        },
        'Elements': {
            exports: 'Elements'
        },
        'X2JS': {
            exports: 'X2JS'
        },
        'RC4': {
            exports: 'RC4'
        },
        'nouislider': {
            exports: 'nouislider'
        },
        'Knob': {
            exports: 'knob'
        },
        'TouchPunch': {
            exports: 'TouchPunch',
            deps: ['jqueryui']
        },
        'ComBroker': {
            deps: ['backbone', 'jquery']
        },
        'Pepper': {
            deps: ['jquery', 'Base64'],
            exports: 'Pepper'
        },
        'PepperHelper': {
            exports: 'PepperHelper'
        },
        'Base64': {
            deps: ['jquery'],
            exports: 'base64'
        },
        'ScreenTemplate': {
            exports: 'ScreenTemplate'
        },
        'colorpicker': {
            deps: ['jquery', 'jqueryui'],
            exports: 'colorpicker'
        },
        'minicolors': {
            deps: ['jquery'],
            exports: 'minicolors'
        },
        'gradient': {
            deps: ['jquery', 'colorpicker', 'jqueryui']
        }
    }
});

if (window.location.href.indexOf('dist') > -1) {
    requirejs.onError = function (err) {
        console.log('require js error ' + err);
    }
}

require(['StudioLite'], function (StudioLite) {
    new StudioLite();
});