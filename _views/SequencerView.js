/**
 The sequencer module is responsible for management and order of playback of each timeline within the campaign
 @class SequencerView
 @constructor
 @param {String} i_container element that CompCampaignNavigator inserts itself into
 @return {Object} instantiated CompCampaignNavigator
 **/
define(['jquery', 'backbone', 'jqueryui', 'ScreenTemplateFactory'], function ($, Backbone, jqueryui, ScreenTemplateFactory) {

    BB.SERVICES.SEQUENCER_VIEW = 'SequencerView';

    var SequencerView = BB.View.extend({

        /**
         Constructor
         Init the instance and enable drag and drop operation.
         We also wire the open properties UI so we can populate a selected timeline through the properties panel.
         @method initialize
         **/
        initialize: function () {
            var self = this;
            this.m_thumbsContainer = this.$el;
            this.m_timelines = {};
            this.m_screenTemplates = {};

            self._initLayoutSelectorDragDrop();
            setTimeout(function () {
                $(Elements.ATTACH_DRAG_DROP_MAIN_SCREEN_SELECTION).trigger('click');
            }, 3000);

            pepper.listen(Pepper.TIMELINE_DELETED, $.proxy(self._deleteSequencedTimeline, self));

        },

        /**
         Enable drag and drop operations on the thumbnail timelines within the Sequencer UI.
         @method _initLayoutSelectorDragDrop
         @return none
         **/
        _initLayoutSelectorDragDrop: function () {
            var self = this;

            // Regular popup
            // $("#popupUndismissible").popup( "open", {x: 90, y: 90, width: '400', height: '400'});

            $(Elements.ATTACH_DRAG_DROP_MAIN_SCREEN_SELECTION).on('click', function () {

                var h = $(Elements.SCREEN_LAYOUTS_UL).height();
                var t = h * 10 / 100;
                $('.draggableScreenPlaceHolder').css({height: h, top: '-' + h + 'px'});

                self.m_thumbsContainer.sortable({
                    revert: 200,
                    axis: 'x',
                    opacity: 1.0,
                    placeholder: 'draggableScreenPlaceHolder',
                    start: function (e, ui) {
                        // $(ui.placeholder).slideUp();
                        $(ui.placeholder).hide();
                    },

                    stop: function () {
                        $(Elements.DETTACH_DRAG_DROP_MAIN_SCREEN_SELECTION).trigger('click');
                        $(Elements.ATTACH_DRAG_DROP_MAIN_SCREEN_SELECTION).trigger('click');
                        self.reSequenceTimelines();
                    },

                    change: function (e, ui) {
                        $(ui.placeholder).stop(true).animate({width: '0px'}, 100).css({width: '0px'}).slideDown({duration: 0.5}).animate({width: '100px'});
                        // $(ui.placeholder).stop(true).animate({width: '0px'},100).css({width: '0px'}).slideDown({duration: 0.2}).animate({width: '8px'},0.300);
                    },
                    scrollSpeed: 120,
                    containment: self.m_thumbsContainer,
                    delay: 200,
                    scroll: true
                }).disableSelection();

            });

            $(Elements.DETTACH_DRAG_DROP_MAIN_SCREEN_SELECTION).on('click', function () {
                $(self.m_thumbsContainer).disableSelection();
                self.m_thumbsContainer.sortable('destroy');
            });
        },

        /**
         Delete a timeline from the Sequencer UI, as well as from the local member m_timelines.
         @method _deleteSequencedTimeline
         @param {Number} i_campaign_timeline_id
         @return none
         **/
        _deleteSequencedTimeline: function (e) {
            var self = this;
            var campaign_timeline_id = e.edata;
            self._deleteTimelineThumbUI(campaign_timeline_id);
            delete self.m_timelines[campaign_timeline_id];
            pepper.removeTimelineFromSequences(campaign_timeline_id);
            self.reSequenceTimelines();
        },

        /**
         Remove the element's UI thumb of a template layout
         @method _deleteTimelineThumbUI
         @param {Number} i_campaign_timeline_id
         **/
        _deleteTimelineThumbUI: function (i_campaign_timeline_id) {
            var self = this;
            var elementID = self.m_timelines[i_campaign_timeline_id];
            $('#' + elementID).remove();
            self.m_screenTemplates[i_campaign_timeline_id].destroy();
        },

        /**
         Create the timeline template (a.k.a timeline thumbnail) via the ScreenTemplateFactory
         and insert it into the sequencer UI. We proceed by activating the newly created timeline thumbnail
         via the ScreenTemplateFactory public methods.
         @method createTimelineThumbnailUI
         @param {Object} i_screenProps
         **/
        createTimelineThumbnailUI: function (i_screenProps) {
            var self = this;
            var index = -1;
            var elem = undefined;

            // Get the timeline id for current timeline creating
            for (var screenProp in i_screenProps) {
                var campaign_timeline_id = i_screenProps[screenProp]['campaign_timeline_id']
                break;
            }

            // if timeline_id already exists, it means this is an update from ScreenLayoutEditorView so we
            // must first delete previous UI as well as it's matching instance
            if (self.m_timelines[campaign_timeline_id] != undefined) {
                var elementID = '#' + self.m_timelines[campaign_timeline_id];
                index = $(elementID).index();
                self._deleteTimelineThumbUI(campaign_timeline_id);
            }

            var screenTemplateData = {
                orientation: BB.comBroker.getService(BB.SERVICES.ORIENTATION_SELECTOR_VIEW).getOrientation(),
                resolution: BB.comBroker.getService(BB.SERVICES.RESOLUTION_SELECTOR_VIEW).getResolution(),
                screenProps: i_screenProps,
                scale: '14'
            };

            var screenTemplate = new ScreenTemplateFactory({
                i_screenTemplateData: screenTemplateData,
                i_type: BB.CONSTS.ENTIRE_SELECTABLE,
                i_owner: this
            });

            var snippet = screenTemplate.create();
            var elementID = $(snippet).attr('id');

            self.m_timelines[campaign_timeline_id] = elementID;
            self.m_screenTemplates[campaign_timeline_id] = screenTemplate;

            screenTemplate.selectablelDivision();
            screenTemplate.activate();

            switch (index) {
                case -1:
                {
                    // position thumbnail in beginning (first creation)
                    self.m_thumbsContainer.append(snippet);
                    screenTemplate.selectableFrame();
                    break;
                }

                case 0:
                {
                    // position thumbnail index in beginning (append if no other thumbnails)
                    elem = self.m_thumbsContainer.children().eq(0);
                    if (elem.length > 0) {
                        $(snippet).insertBefore(elem)
                    } else {
                        self.m_thumbsContainer.append(snippet);
                    }
                    screenTemplate.selectableFrame();
                    break;
                }

                default:
                {
                    // position thumbnail as previous index position
                    elem = self.m_thumbsContainer.children().eq(index - 1);
                    $(snippet).insertAfter(elem)
                    screenTemplate.selectableFrame();
                    break;
                }
            }
        },

        /**
         Reorder the timeline in the local msdb to match the UI order of the timeline thumbnails in the Sequencer
         @method reSequenceTimelines
         @return none
         **/
        reSequenceTimelines: function () {
            var self = this;
            var timelines = $(self.m_thumbsContainer).children().each(function (sequenceIndex) {
                var element = $(this).find('[data-campaign_timeline_id]').eq(0);
                var campaign_timeline_id = $(element).data('campaign_timeline_id');
                var selectedCampaign = BB.comBroker.getService(BB.SERVICES.CAMPAIGN_VIEW).getSelectedCampaign();
                pepper.setCampaignTimelineSequencerIndex(selectedCampaign, campaign_timeline_id, sequenceIndex);
            });
        },

        /**
         Return this instance.
         @method getOwner
         @return {Object} this
         **/
        getOwner: function () {
            return this;
        },

        /**
         Find the campaign_timeline_id within the Sequencer and trigger a click event on it so it gets selected.
         @method selectTimeline
         @param {Number} i_campaign_timeline_id
         @return {Number} i_campaign_timeline_id or -1
         **/
        selectTimeline: function (i_campaign_timeline_id) {
            var self = this;
            var total = $(self.m_thumbsContainer).find('[data-campaign_timeline_id="' + i_campaign_timeline_id + '"]').eq(0).trigger('click');
            if (total.length == 0)
                return -1;
            return i_campaign_timeline_id;
        }
    });

    return SequencerView;

});