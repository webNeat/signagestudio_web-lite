/**
 StudioLite MediaSignage Inc (c) open source digital signage project.
 Visit Github for license and docs: http://git.digitalsignage.com
 @class StudioLite
 @constructor
 @return {Object} instantiated StudioLite
 **/
define(['underscore', 'jquery', 'backbone', 'bootstrap', 'backbone.controller', 'Services', 'ComBroker', 'Lib'], function (_, $, Backbone, Bootstrap, backbonecontroller, Services, ComBroker, Lib) {
    var StudioLite = Backbone.Controller.extend({

        // application init
        initialize: function () {

            Backbone.globs = {};
            Backbone.lib = new Lib();
            Backbone.lib.addBackboneViewOptions();
            Backbone.comBroker = new ComBroker();
            window.log = Backbone.lib.log;

            // router init
            require(['LayoutManager'],function(LayoutManager){
                var layoutManager = new LayoutManager();
                Backbone.history.start();
                Backbone.comBroker.setService(Services.LAYOUT_MANAGER, layoutManager);
                layoutManager.navigate('unauthenticated', {trigger: true});
            })
        }
    });
    return StudioLite;
});