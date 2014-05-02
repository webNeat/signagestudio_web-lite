/**
 Pepper SDK is a collection of files that provide a wrapper for the Soap API used to communicate with MediaSignage servers.
 The SDK makes programming easier by abstracting some of the tedious tasks such as enumeration.

 The msdb internal Database is the magic sauce as it maps against the actual mediaSERVER remote database via
 local generated handles (a.k.a IDs). Once a user saves the local configuration, the local Database is serialized
 and pushed onto the a remote mediaSERVER. This allows for the user to work offline without the need for constant network
 communication until a save is initiated.

 The internal database is referenced as msdb in both code and documentation.

 Library requirements:
 composition: x2js, jQuery
 inheritance: ComBroker

 @class Pepper
 @constructor
 @return {Object} Pepper instance
 **/
function Pepper() {
    this.m_user = undefined;
    this.m_pass = undefined;
    this.m_msdb = undefined;
    this.m_loaderManager = undefined;
};

/**
 Custom event fired when a total timeline length (i.e.: channel content within specified timeline) has changed
 @event Pepper.TIMELINE_LENGTH_CHANGED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.TIMELINE_LENGTH_CHANGED = 'TIMELINE_LENGTH_CHANGED';

/**
 Custom event fired when a total timeline length (i.e.: channel content within specified timeline) has changed
 @event Pepper.TIMELINE_LENGTH_CHANGED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.TEMPLATE_VIEWER_EDITED = 'TEMPLATE_VIEWER_EDITED';

/**
 Custom event fired when a timeline is removed from campaign
 @event Pepper.TIMELINE_DELETED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.TIMELINE_DELETED = 'TIMELINE_DELETED';

/**
 Custom event fired when a new player (aka block) was created
 @event Pepper.NEW_PLAYER_CREATED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_PLAYER_CREATED = 'NEW_PLAYER_CREATED';

/**
 Custom event fired when a new campaign was created
 @event Pepper.NEW_CAMPAIGN_CREATED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_CAMPAIGN_CREATED = 'NEW_CAMPAIGN_CREATED';

/**
 Custom event fired when a new template (aka screen division layout in global) was created
 @event Pepper.NEW_TEMPLATE_CREATED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_TEMPLATE_CREATED = 'NEW_TEMPLATE_CREATED';


/**
 Custom event fired when a new timeline was created
 @event Pepper.NEW_TIMELINE_CREATED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_TIMELINE_CREATED = 'NEW_TIMELINE_CREATED';

/**
 Custom event fired when a new channel was created
 @event Pepper.NEW_CHANNEL_CREATED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_CHANNEL_CREATED = 'NEW_CHANNEL_CREATED';

/**
 Custom event fired when a new channel is added to an existing timeline
 @event Pepper.NEW_CHANNEL_ADDED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.NEW_CHANNEL_ADDED = 'NEW_CHANNEL_ADDED';

/**
 Custom event fired when a block (ie Player on channel) changes it's total playback length
 @event Pepper.BLOCK_LENGTH_CHANGED
 @param {This} caller
 @param {Event}
 @static
 @final
 **/
Pepper.BLOCK_LENGTH_CHANGED = 'BLOCK_LENGTH_CHANGED';

Pepper.prototype = {
    constructor: Pepper,

    /**
     Authenticate against a mediaSERVER
     @method dbConnect
     @param {String} i_user
     @param {String} i_pass
     @param {Function} i_callBack
     @return none
     **/
    dbConnect: function (i_user, i_pass, i_callBack) {
        var self = this;
        self.m_user = i_user;
        self.m_pass = i_pass;
        self.m_loaderManager = new LoaderManager();
        self.m_msdb = self.m_loaderManager['m_dataBaseManager'];
        self.m_loaderManager.create(self.m_user, self.m_pass, function (i_result) {
            if (i_result.status) {
                self.m_authenticated = true;
                self.m_domain = self.m_loaderManager['m_domain'];
                self.m_businessID = self.m_loaderManager['m_businessId'];
                self.m_authTime = Date.now();
            }
            i_callBack(i_result);
        });
    },

    /**
     Return all authenticated user data
     @method getUserData
     @return {Object} reference to all user data
     **/
    getUserData: function () {
        var self = this;
        return {
            userName: self.m_user,
            userPass: self.m_pass,
            domain: self.m_domain,
            businessID: self.m_businessID,
            authTime: self.m_authTime
        };
    },

    /**
     Returns a reference to the Pepper loader
     @method getLoader
     @return {Object} reference to loader
     **/
    getLoader: function () {
        var self = this;
        return self.m_loaderManager;
    },

    /**
     Serialize the local msdb and push to remote server
     @method save
     @return none
     **/
    save: function (i_callback) {
        var self = this;
        self.m_loaderManager.save(i_callback);
    },

    /**
     Sync internal msdb to remote mediaSERVER account
     @method requestData
     @param {Function} i_callback
     **/
    sync: function (i_callBack) {
        var self = this;
        self.m_loaderManager.requestData(function (i_callBack) {
        });
    },

    /**
     Push a command to remote station
     @method sendCommand
     @param {String} i_command
     @param {Number} i_stationId
     @param {Function} i_callBack
     **/
    sendCommand: function (i_command, i_stationId, i_callBack) {
        var url = 'https://' + pepper.getUserData().domain + '/WebService/sendCommand.ashx?i_user=' + pepper.getUserData().userName + '&i_password=' + pepper.getUserData().userPass + '&i_stationId=' + i_stationId + '&i_command=' + i_command + '&i_param1=' + 'SignageStudioLite' + '&i_param2=' + '&callback=?';
        $.getJSON(url, i_callBack);
    },

    /**
     Push an event to remote station
     @method sendEvent
     @param {String} i_eventName
     @param {Number} i_stationId
     @param {Function} i_callBack
     **/
    sendEvent: function (i_eventName, i_stationId, i_callBack) {
        var url = 'https://' + pepper.getUserData().domain + '/WebService/sendCommand.ashx?i_user=' + pepper.getUserData().userName + '&i_password=' + pepper.getUserData().userPass + '&i_stationId=' + i_stationId + '&i_command=event&i_param1=' + i_eventName + '&i_param2=' + '&callback=?';
        $.getJSON(url, i_callBack);
    },

    /**
     Send remote command to retrieve snapshot of a running station
     @method sendSnapshot
     @param {String} i_fileName
     @param {Number} i_quality
     @param {Number} i_stationId
     @param {Function} i_callBack
     @return {String} image path url
     **/
    sendSnapshot: function (i_fileName, i_quality, i_stationId, i_callBack) {
        var url = 'https://' + pepper.getUserData().domain + '/WebService/sendCommand.ashx?i_user=' + pepper.getUserData().userName + '&i_password=' + pepper.getUserData().userPass + '&i_stationId=' + i_stationId + '&i_command=' + 'captureScreen2' + '&i_param1=' + i_fileName + '&i_param2=' + i_quality + '&callback=?';
        $.getJSON(url, i_callBack);
        var path = 'https://' + pepper.getUserData().domain + '/Snapshots/business' + pepper.getUserData().businessID + "/station" + i_stationId + '/' + i_fileName + '.jpg';
        log(path);
        return path;
    },

    /**
     Returns this model's attributes as...
     @method i_values  var o = {
                    campaign_timeline_board_template_id: ?
                    board_template_viewer_id: ?
                };
     @param {i_values} i_playerData
     **/
    announceTemplateViewerEdited: function (i_values) {
        var self = this;
        pepper.fire(Pepper['TEMPLATE_VIEWER_EDITED'], self, null, i_values);
    },

    /**
     Create a new campaign in the local database
     @method createCampaign
     @param {Number} i_campgianName
     @return {Number} campaign id created
     **/
    createCampaign: function (i_campgianName) {
        var self = this;
        var campaigns = self.m_msdb.table_campaigns();
        var campaign = campaigns.createRecord();
        campaign.campaign_name = i_campgianName;
        campaigns.addRecord(campaign);
        pepper.fire(Pepper['NEW_CAMPAIGN_CREATED'], self, null, campaign['campaign_id']);
        return campaign['campaign_id'];
    },

    /**
     Create a new board, also known as Screen (screen divisions reside inside the board as viewers)
     @method createBoard
     @param {Number} i_boardName
     @param {Number} i_width of the board
     @param {Number} i_height of the board
     @return {Number} the board id
     **/
    createBoard: function (i_boardName, i_width, i_height) {
        var self = this;
        var boards = self.m_msdb.table_boards();
        var board = boards.createRecord();
        board.board_name = i_boardName;
        board.board_pixel_width = i_width;
        board.board_pixel_height = i_height;
        boards.addRecord(board);
        return board['board_id'];
    },

    /**
     Assign a campaign to a board, binding the to by referenced ids
     @method assignCampaignToBoard
     @param {Number} i_campaign_id the campaign id to assign to board
     @param {Number} i_board_id the board id to assign to campaign
     @return {Number} campain_board_id
     **/
    assignCampaignToBoard: function (i_campaign_id, i_board_id) {
        var self = this;
        var campaign_boards = self.m_msdb.table_campaign_boards();
        var campain_board = campaign_boards.createRecord();
        campain_board.campaign_id = i_campaign_id;
        campain_board.board_id = i_board_id;
        campaign_boards.addRecord(campain_board);
        return campain_board['campaign_board_id'];
    },

    /**
     Get the first board_id (output) that is assigned to the specified campaign_id
     @method getFirstBoardIDofCampaign
     @param {Number} i_campaign_id
     @return {Number} foundBoardID of the board, or -1 if none found
     **/
    getFirstBoardIDofCampaign: function (i_campaign_id) {
        var self = this;
        var totalBoardsFound = 0;
        var foundCampainBoardID = -1;

        $(self.m_msdb.table_campaign_boards().getAllPrimaryKeys()).each(function (k, campaign_board_id) {
            var recCampaignBoard = self.m_msdb.table_campaign_boards().getRec(campaign_board_id);
            if (i_campaign_id == recCampaignBoard.campaign_id && totalBoardsFound == 0) {
                foundCampainBoardID = recCampaignBoard['campaign_board_id']
                totalBoardsFound++;
            }
        });

        return foundCampainBoardID;
    },

    /**
     Translate a campaign_board into it's matching pair in global boards.
     @method getBoardFromCampaignBoard
     @param {Number} i_campaign_board_id
     @return {Number} board_id
     **/
    getBoardFromCampaignBoard: function (i_campaign_board_id) {
        var self = this;
        var recCampaignBoard = self.m_msdb.table_campaign_boards().getRec(i_campaign_board_id);
        return recCampaignBoard.board_id;
    },

    /**
     Translate i_campaign_board_id into campaign_id using local table_campaign_boards (not global boards)
     @method getCampaignIdFromCampaignBoardId
     @param {Number} i_campaign_board_id
     @return {Number} campaign_id
     **/
    getCampaignIdFromCampaignBoardId: function (i_campaign_board_id) {
        var self = this;
        var recCampaignBoard = self.m_msdb.table_campaign_boards().getRec(i_campaign_board_id);
        return recCampaignBoard.campaign_id;
    },

    /**
     Translate i_campaign_id into campaign_board_id using local table_campaign_boards (not global boards)
     @method getCampaignIdFromCampaignBoardId
     @param {Number} i_campaign_board_id
     @return {Number} campaign_id
     **/
    getCampaignBoardIdFromCampaignId: function (i_campaign_id) {
        var self = this;
        var found_campaign_board_id = -1;
        $(self.m_msdb.table_campaign_boards().getAllPrimaryKeys()).each(function (k, campaign_board_id) {
            var recCampaignBoard = self.m_msdb.table_campaign_boards().getRec(campaign_board_id);
            if (recCampaignBoard['campaign_id'] == i_campaign_id)
                found_campaign_board_id = recCampaignBoard['campaign_board_id'];
        });
        return found_campaign_board_id;
    },

    /**
     Create channel and assign that channel to the specified timeline
     @method createTimelineChannel
     @param {Number} i_campaign_timeline_id the timeline id to assign channel to
     @return {Array} createdChanels array of channel ids created
     **/
    createTimelineChannel: function (i_campaign_timeline_id) {
        var self = this;
        var chanels = self.m_msdb.table_campaign_timeline_chanels();
        var chanel = chanels.createRecord();
        chanel.chanel_name = "CH";
        chanel.campaign_timeline_id = i_campaign_timeline_id;
        chanels.addRecord(chanel);
        pepper.fire(Pepper['NEW_CHANNEL_ADDED'], self, null, {chanel: chanel['campaign_timeline_chanel_id'], campaign_timeline_id: i_campaign_timeline_id});
        return chanel['campaign_timeline_chanel_id'];
    },

    /**
     Create channels and assign these channels to the timeline
     @method createTimelineChannels
     @param {Number} i_campaign_timeline_id the timeline id to assign channel to
     @param {Object} i_viewers we use viewer as a reference count to know how many channels to create (i.e.: one per channel)
     @return {Array} createdChanels array of channel ids created
     **/
    createTimelineChannels: function (i_campaign_timeline_id, i_viewers) {
        var self = this;
        var createdChanels = [];

        for (var i in i_viewers) {
            i++;
            var chanels = self.m_msdb.table_campaign_timeline_chanels();
            var chanel = chanels.createRecord();
            chanel.chanel_name = "CH" + i;
            chanel.campaign_timeline_id = i_campaign_timeline_id;
            chanels.addRecord(chanel);
            createdChanels.push(chanel['campaign_timeline_chanel_id']);
        }
        pepper.fire(Pepper['NEW_CHANNEL_CREATED'], self, null, createdChanels);
        return createdChanels;
    },

    /**
     Create a new global template (screen and viewers) and assign the new template to the given global board_id
     @method createNewTemplate
     @param {Number} i_board_id
     @param {Object} i_screenProps json object with all the viewers and attributes to create in msdb
     @return {Object} returnData encapsulates the board_template_id and board_template_viewer_ids created
     **/
    createNewTemplate: function (i_board_id, i_screenProps) {
        var self = this;

        var returnData = {
            board_template_id: -1,
            viewers: []
        };
        // create screen template under board_id
        var boardTemplates = self.m_msdb.table_board_templates();
        var boardTemplate = boardTemplates.createRecord();
        boardTemplate.template_name = "board template";
        boardTemplate.board_id = i_board_id; // bind screen template to board
        boardTemplates.addRecord(boardTemplate);

        var board_template_id = boardTemplate['board_template_id'];

        // add viewers (screen divisions)
        var viewers = self.m_msdb.table_board_template_viewers();
        var i = 0;
        for (var screenValues in i_screenProps) {
            i++;
            var viewer = viewers.createRecord();
            viewer.viewer_name = "Viewer" + i;
            viewer.pixel_width = i_screenProps[screenValues]['w'];
            viewer.pixel_height = i_screenProps[screenValues]['h'];
            viewer.pixel_x = i_screenProps[screenValues]['x'];
            viewer.pixel_y = i_screenProps[screenValues]['y'];
            viewer.board_template_id = boardTemplate.board_template_id; // bind screen division to screen template
            viewers.addRecord(viewer);
            returnData['viewers'].push(viewer['board_template_viewer_id']);
        }
        returnData['board_template_id'] = board_template_id
        pepper.fire(Pepper['NEW_TEMPLATE_CREATED'], self, null, returnData);
        return returnData;
    },

    /**
     Create a global viewer in an existing board_template
     @method createViewer
     @param {Number} board_template_id
     @param {Number} i_board_template_id
     @param {Object} i_props
     @return {Number} viewer id
     **/
    createViewer: function (i_board_template_id, i_props) {
        var self = this;
        var viewers = self.m_msdb.table_board_template_viewers();
        var viewer = viewers.createRecord();
        viewer.viewer_name = "Viewer";
        viewer.pixel_width = i_props['w'];
        viewer.pixel_height = i_props['h'];
        viewer.pixel_x = i_props['x'];
        viewer.pixel_y = i_props['y'];
        viewer.board_template_id = i_board_template_id;
        viewers.addRecord(viewer);
        return viewer['board_template_viewer_id'];
    },

    /**
     Change a viewer's (aka screen division) order (layer) z-order
     @method updateTemplateViewerOrder
     @param {number} board_template_viewer_id
     @param {number} i_playerData
     **/
    updateTemplateViewerOrder: function(i_board_template_viewer_id, i_zorder){
        var self = this;
        self.m_msdb.table_board_template_viewers().openForEdit(i_board_template_viewer_id);
        var recEditBoardTemplateViewer = self.m_msdb.table_board_template_viewers().getRec(i_board_template_viewer_id);
        recEditBoardTemplateViewer['viewer_order'] = i_zorder;
    },

    /**
     Create a new timeline under the specified campaign_id
     @method createNewTimeline
     @param {Number} i_campaign_id
     @return {Number} campaign_timeline_id the timeline id created
     **/
    createNewTimeline: function (i_campaign_id) {
        var self = this;
        var timelines = self.m_msdb.table_campaign_timelines();
        var timeline = timelines.createRecord();
        timeline.campaign_id = i_campaign_id;
        timeline.timeline_name = "Timeline";
        timelines.addRecord(timeline);
        pepper.fire(Pepper['NEW_TIMELINE_CREATED'], self, null, timeline['campaign_timeline_id']);
        return timeline['campaign_timeline_id'];
    },

    /**
     Create a new player (a.k.a block) and add it to the specified channel_id
     @method createNewPlayer
     @param {Number} i_campaign_timeline_chanel_id is the channel id assign player to
     @param {Number} i_playerCode is a unique pre-set code that exists per type of block (see component list for all available code)
     @param {Number} i_offset set in seconds of when to begin playing the content with respect to timeline_channel
     @param {Number} i_resourceID optional param used when creating a block with embedded resource (i.e.: video / image / swf)
     @return {Object} campaign_timeline_chanel_player_id and campaign_timeline_chanel_player_data as json object
     **/
    createNewPlayer: function (i_campaign_timeline_chanel_id, i_playerCode, i_offset, i_resourceID) {
        var self = this;

        var timelinePlayers = self.m_msdb.table_campaign_timeline_chanel_players();
        var recTimelinePlayer = timelinePlayers.createRecord();
        var component = BB.PepperHelper.getBlockBoilerplate(i_playerCode);
        var player_data = component.getDefaultPlayerData(i_resourceID);
        recTimelinePlayer.player_data = player_data;
        recTimelinePlayer.campaign_timeline_chanel_id = i_campaign_timeline_chanel_id;
        recTimelinePlayer.player_duration = 10;
        recTimelinePlayer.player_offset_time = i_offset;
        timelinePlayers.addRecord(recTimelinePlayer);

        var returnData = {
            campaign_timeline_chanel_player_id: recTimelinePlayer['campaign_timeline_chanel_player_id'],
            campaign_timeline_chanel_player_data: recTimelinePlayer['player_data']
        };
        pepper.fire(Pepper['NEW_PLAYER_CREATED'], self, null, returnData);
        return returnData;
    },

    /**
     Get all the campaign > timeline > board > template ids of a timeline
     @method getTemplatesOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} template ids
     **/
    getTemplatesOfTimeline: function (i_campaign_timeline_id) {
        var self = this;
        var foundTemplatesIDs = [];

        $(pepper.m_msdb.table_campaign_timeline_board_templates().getAllPrimaryKeys()).each(function (k, table_campaign_timeline_board_template_id) {
            var recCampaignTimelineBoardTemplate = pepper.m_msdb.table_campaign_timeline_board_templates().getRec(table_campaign_timeline_board_template_id);
            if (recCampaignTimelineBoardTemplate['campaign_timeline_id'] == i_campaign_timeline_id) {
                foundTemplatesIDs.push(table_campaign_timeline_board_template_id);
            }
        });
        return foundTemplatesIDs;
    },

    /**
     Set a Board Template Viewer props
     @method setBoardTemplateViewer
     @param {Number} i_board_template_viewer_id
     @return {Number} i_props
     **/
    setBoardTemplateViewer: function (i_campaign_timeline_board_template_id, i_board_template_viewer_id, i_props) {
        var self = this;
        var x = Math.round(i_props.x);
        var y = Math.round(i_props.y);
        var w = Math.round(i_props.w);
        var h = Math.round(i_props.h);

        // log('savings: template_id: ' + i_campaign_timeline_board_template_id + ' view_id: ' + i_board_template_viewer_id + ' ' + x + 'x' + y + ' ' + w + '/' + h);

        self.m_msdb.table_board_template_viewers().openForEdit(i_board_template_viewer_id);
        var recEditBoardTemplateViewer = self.m_msdb.table_board_template_viewers().getRec(i_board_template_viewer_id);
        recEditBoardTemplateViewer['pixel_x'] = x;
        recEditBoardTemplateViewer['pixel_y'] = y;
        recEditBoardTemplateViewer['pixel_width'] = w;
        recEditBoardTemplateViewer['pixel_height'] = h;
        var o = {
            campaign_timeline_board_template_id: i_campaign_timeline_board_template_id,
            board_template_viewer_id: i_board_template_viewer_id,
        };
        pepper.announceTemplateViewerEdited(o);
    },

    /**
     Get a Board Template Viewer props
     @method getBoardTemplateViewer
     @param {Number} i_board_template_viewer_id
     @return {Number} i_props
     **/
    getBoardTemplateViewer: function (i_board_template_viewer_id) {
        var self = this;
        var recEditBoardTemplateViewer = self.m_msdb.table_board_template_viewers().getRec(i_board_template_viewer_id);
        return {
            x: recEditBoardTemplateViewer['pixel_x'],
            y: recEditBoardTemplateViewer['pixel_y'],
            w: recEditBoardTemplateViewer['pixel_width'],
            h: recEditBoardTemplateViewer['pixel_height']
        };
    },

    /**
     Get all the global board template ids of a timeline
     @method getGlobalTemplateIdOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} foundGlobalBoardTemplatesIDs global board template ids
     **/
    getGlobalTemplateIdOfTimeline: function (i_campaign_timeline_id) {
        var self = this;
        var foundGlobalBoardTemplatesIDs = [];

        $(pepper.m_msdb.table_campaign_timeline_board_templates().getAllPrimaryKeys()).each(function (k, table_campaign_timeline_board_template_id) {
            var recCampaignTimelineBoardTemplate = pepper.m_msdb.table_campaign_timeline_board_templates().getRec(table_campaign_timeline_board_template_id);
            if (recCampaignTimelineBoardTemplate['campaign_timeline_id'] == i_campaign_timeline_id) {
                foundGlobalBoardTemplatesIDs.push(recCampaignTimelineBoardTemplate['board_template_id']);
            }
        });
        return foundGlobalBoardTemplatesIDs;
    },

    /**
     Get all the campaign > timeline > channels ids of a timeline
     @method getChannelsOfTimeline
     @param {Number} i_campaign_timeline_id
     @return {Array} channel ids
     **/
    getChannelsOfTimeline: function (i_campaign_timeline_id) {
        var self = this;
        var foundChannelsIDs = [];

        $(pepper.m_msdb.table_campaign_timeline_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_id) {
            var recCampaignTimelineChannel = pepper.m_msdb.table_campaign_timeline_chanels().getRec(campaign_timeline_chanel_id);
            if (i_campaign_timeline_id == recCampaignTimelineChannel['campaign_timeline_id']) {
                foundChannelsIDs.push(campaign_timeline_chanel_id);
            }
        });
        return foundChannelsIDs;
    },

    /**
     Get a block's record using it's block_id
     @method getBlockRecord
     @param {Number} i_block_id
     @return {Object} recBlock
     **/
    getBlockRecord: function (i_block_id) {
        var self = this;
        return self.m_msdb.table_campaign_timeline_chanel_players().getRec(i_block_id);
    },

    /**
     Set a block's record using key value pair
     The method uses generic key / value fields so it can set any part of the record.
     @method setBlockRecord
     @param {Number} i_block_id
     @param {String} i_key
     @param {Number} i_value
     @return none
     **/
    setBlockRecord: function (i_block_id, i_key, i_value) {
        var self = this;
        pepper.m_msdb.table_campaign_timeline_chanel_players().openForEdit(i_block_id);
        var recEditBlock = self.m_msdb.table_campaign_timeline_chanel_players().getRec(i_block_id);
        recEditBlock[i_key] = i_value;
    },

    /**
     Get the total duration in seconds of all given block ids
     @method getTotalDurationOfBlocks
     @param {Array} i_blocks
     @return {Number} totalChannelLength
     **/
    getTotalDurationOfBlocks: function (i_blocks) {
        var self = this;
        var totalChannelLength = 0;

        for (var i = 0; i < i_blocks.length; i++) {
            var block_id = i_blocks[i];
            $(pepper.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
                if (block_id == campaign_timeline_chanel_player_id) {
                    var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
                    var playerDuration = recCampaignTimelineChannelPlayer['player_duration']
                    pepper.m_msdb.table_campaign_timeline_chanel_players().openForEdit(campaign_timeline_chanel_player_id);
                    // log('player ' + block_id + ' offset ' + totalChannelLength + ' playerDuration ' + playerDuration);
                    totalChannelLength = totalChannelLength + parseFloat(playerDuration);
                }
            });
        }
        return totalChannelLength;
    },

    /**
     Get a global board record (not the board that assigned to a campaign, but global).
     Keep in mind that we only give as an argument the campaign > timeline > board > template id, so we have to query it and find
     out to which global board its pointing so we can grab the correct record for the correct global board.
     @method getGlobalBoardRecFromTemplate
     @param {Number} i_campaign_timeline_board_template_id to reverse map into global board
     @return {Object} global board record;
     **/
    getGlobalBoardRecFromTemplate: function (i_campaign_timeline_board_template_id) {
        var self = this;
        var recCampaignTimelineBoardTemplate = pepper.m_msdb.table_campaign_timeline_board_templates().getRec(i_campaign_timeline_board_template_id);
        var board_template_id = recCampaignTimelineBoardTemplate['board_template_id'];
        var recBoardTemplate = pepper.m_msdb.table_board_templates().getRec(board_template_id);
        var board_id = recBoardTemplate['board_id'];
        var recBoard = pepper.m_msdb.table_boards().getRec(board_id);
        return recBoard;
    },

    /**
     Get a timeline's global board_id that is mapped to its local table_campaign_timeline_board_template id
     @method getGlobalBoardIDFromTimeline
     @param {Number} i_playerData
     @return {Number} board_id
     **/
    getGlobalBoardIDFromTimeline: function (i_campaign_timeline_board_template_id) {
        var recCampaignTimelineBoardTemplate = pepper.m_msdb.table_campaign_timeline_board_templates().getRec(i_campaign_timeline_board_template_id);
        var board_template_id = recCampaignTimelineBoardTemplate['board_template_id'];
        var recBoardTemplate = pepper.m_msdb.table_board_templates().getRec(board_template_id);
        return recBoardTemplate['board_id'];
    },

    /**
     Bind the template (screen division template)to the specified timeline (i_campaign_timeline_id).
     We need to also provide the board_template_id (screen template of the global board) as well as
     the campaign's board_id to complete the binding
     @method assignTemplateToTimeline
     @param {Number} i_campaign_timeline_id to assign to template
     @param {Number} i_board_template_id is the global board id (does not belong to campaign) to assign to the template
     @param {Number} i_campaign_board_id is the campaign specific board id that will be bound to the template
     @return {Number} campaign_timeline_board_template_id
     **/
    assignTemplateToTimeline: function (i_campaign_timeline_id, i_board_template_id, i_campaign_board_id) {
        var self = this;
        var timelineTemplate = self.m_msdb.table_campaign_timeline_board_templates();
        var timelineScreen = timelineTemplate.createRecord();
        timelineScreen.campaign_timeline_id = i_campaign_timeline_id;
        timelineScreen.board_template_id = i_board_template_id;
        timelineScreen.campaign_board_id = i_campaign_board_id;
        timelineTemplate.addRecord(timelineScreen);

        return timelineScreen['campaign_timeline_board_template_id'];
    },

    /**
     Assign viewer (screen division) on the timeline to channel
     @method assignViewerToTimelineChannel
     @param {Number} i_campaign_timeline_board_template_id
     @param {Object} i_viewers a json object with all viewers
     @param {Array} i_channels a json object with all channels
     @return none
     **/
    assignViewerToTimelineChannel: function (i_campaign_timeline_board_template_id, i_viewer_id, i_channel_id) {
        var self = this;
        var viewerChanels = self.m_msdb.table_campaign_timeline_board_viewer_chanels();
        var viewerChanel = viewerChanels.createRecord();
        viewerChanel.campaign_timeline_board_template_id = i_campaign_timeline_board_template_id;
        viewerChanel.board_template_viewer_id = i_viewer_id;
        viewerChanel.campaign_timeline_chanel_id = i_channel_id;
        viewerChanels.addRecord(viewerChanel);
    },

    /**
     Assign viewers (screen divisions) on the timeline to channels, so we get one viewer per channel
     @method assignViewersToTimelineChannels
     @param {Number} i_campaign_timeline_board_template_id
     @param {Object} i_viewers a json object with all viewers
     @param {Array} i_channels a json object with all channels
     @return none
     **/
    assignViewersToTimelineChannels: function (i_campaign_timeline_board_template_id, i_viewers, i_channels) {
        var self = this;
        var viewerChanels = self.m_msdb.table_campaign_timeline_board_viewer_chanels();
        for (var i in i_viewers) {
            var viewerChanel = viewerChanels.createRecord();
            viewerChanel.campaign_timeline_board_template_id = i_campaign_timeline_board_template_id;
            viewerChanel.board_template_viewer_id = i_viewers[i];
            viewerChanel.campaign_timeline_chanel_id = i_channels.shift();
            viewerChanels.addRecord(viewerChanel);
        }
    },

    /**
     Set the sequence index of a timeline in campaign. If timeline is not found in sequencer, we insert it with the supplied i_sequenceIndex
     @method setCampaignTimelineSequencerIndex
     @param {Number} i_campaign_id
     @param {Number} i_campaign_timeline_id
     @param {Number} i_sequenceIndex is the index to use for the timeline so we can playback the timeline in the specified index order
     @return none
     **/
    setCampaignTimelineSequencerIndex: function (i_campaign_id, i_campaign_timeline_id, i_sequenceIndex) {
        var self = this;
        var updatedSequence = false;
        $(self.m_msdb.table_campaign_timeline_sequences().getAllPrimaryKeys()).each(function (k, campaign_timeline_sequence_id) {
            var recCampaignTimelineSequence = self.m_msdb.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence.campaign_timeline_id == i_campaign_timeline_id) {
                self.m_msdb.table_campaign_timeline_sequences().openForEdit(campaign_timeline_sequence_id);
                var recEditCampaignTimelineSequence = self.m_msdb.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
                recEditCampaignTimelineSequence.sequence_index = i_sequenceIndex;
                recEditCampaignTimelineSequence.sequence_count = 0;
                updatedSequence = true;
            }
        });

        // i_campaign_timeline_id was not found in the sequencer so create new record
        if (updatedSequence == false) {
            var table_campaign_timeline_sequences = self.m_msdb.table_campaign_timeline_sequences();
            var recCampaignTimelineSequence = table_campaign_timeline_sequences.createRecord();
            recCampaignTimelineSequence.sequence_index = i_sequenceIndex;
            recCampaignTimelineSequence.sequence_count = 0;
            recCampaignTimelineSequence.campaign_timeline_id = i_campaign_timeline_id;
            recCampaignTimelineSequence.campaign_id = i_campaign_id;
            table_campaign_timeline_sequences.addRecord(recCampaignTimelineSequence);
        }
    },

    /**
     Get the timeline id of the specific sequencer index offset (0 based) under the specified campaign
     @method getCampaignTimelineIdOfSequencerIndex
     @param {Number} i_campaign_id
     @param {Number} i_sequence_index
     @return {Number} timeline_id
     **/
    getCampaignTimelineIdOfSequencerIndex: function (i_campaign_id, i_sequence_index) {
        var self = this;
        var timeline_id = -1;
        $(self.m_msdb.table_campaign_timeline_sequences().getAllPrimaryKeys()).each(function (k, campaign_timeline_sequence_id) {
            var recCampaignTimelineSequence = self.m_msdb.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            var sequenceIndex = recCampaignTimelineSequence['sequence_index'];
            if (sequenceIndex == i_sequence_index && i_campaign_id == recCampaignTimelineSequence['campaign_id'])
                timeline_id = recCampaignTimelineSequence['campaign_timeline_id']
        });
        return timeline_id;
    },

    /**
     Get the sequence index of a timeline in the specified campaign
     @method getCampaignTimelineSequencerIndex
     @param {Number} i_campaign_timeline_id
     @return {Number} sequenceIndex
     **/
    getCampaignTimelineSequencerIndex: function (i_campaign_timeline_id) {
        var self = this;
        var sequenceIndex = -1;

        $(self.m_msdb.table_campaign_timeline_sequences().getAllPrimaryKeys()).each(function (k, campaign_timeline_sequence_id) {
            var recCampaignTimelineSequence = self.m_msdb.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence['campaign_timeline_id'] == i_campaign_timeline_id) {
                sequenceIndex = recCampaignTimelineSequence['sequence_index'];
            }
        });
        return sequenceIndex;
    },

    /**
     Get all none deleted (!=3) resources per current account
     @method getResources
     @return {Array} all records of all resources in current account
     **/
    getResources: function () {
        var self = this;
        var resources = [];

        $(self.m_msdb.table_resources().getAllPrimaryKeys()).each(function (k, resource_id) {
            var recResource = self.m_msdb.table_resources().getRec(resource_id);
            // dont process deleted resources
            if (recResource['change_type'] == 3)
                return;
            var resourceName = resources.push(recResource);
        });
        return resources;
    },

    /**
     Get a resource record via its resource_id.
     @method getResourceRecord
     @param {Number} i_resource_id
     @return {Object} foundResourceRecord
     **/
    getResourceRecord: function (i_resource_id) {
        var self = this;
        return self.m_msdb.table_resources().getRec(i_resource_id);
    },

    /**
     Set a resource record via its resource_id.
     The method uses generic key / value fields so it can set any part of the record.
     @method setResourceRecord
     @param {Number} i_resource_id
     @param {Number} i_key
     @param {String} i_value
     @return {Object} foundResourceRecord
     **/
    setResourceRecord: function (i_resource_id, i_key, i_value) {
        var self = this;
        self.m_msdb.table_resources().openForEdit(i_resource_id);
        var recResource = self.m_msdb.table_resources().getRec(i_resource_id);
        recResource[i_key] = i_value;
    },

    /**
     Remove a campaign record
     @method removeCampaign
     @param {Number} i_campaign_id
     @return none
     **/
    removeCampaign: function (i_campaign_id) {
        var self = this;
        self.m_msdb.table_campaigns().openForDelete(i_campaign_id);
    },

    /**
     Remove campaign board_id
     @method removeCampaignBoard
     @param {Number} i_campaign_id
     @return none
     **/
    removeCampaignBoard: function (i_campaign_id) {
        var self = this;
        $(self.m_msdb.table_campaign_boards().getAllPrimaryKeys()).each(function (k, campaign_board_id) {
            var recCampaignBoard = self.m_msdb.table_campaign_boards().getRec(campaign_board_id);
            if (recCampaignBoard['campaign_id'] == i_campaign_id) {
                self.m_msdb.table_campaign_boards().openForDelete(campaign_board_id);
            }
        });
    },

    /**
     Remove all boards in msdb
     @method removeAllBoards
     @return none
     **/
    removeAllBoards: function () {
        var self = this;

        $(self.m_msdb.table_boards().getAllPrimaryKeys()).each(function (k, board_id) {
            self.m_msdb.table_boards().openForDelete(board_id);
        });
    },

    /**
     Remove a block (i.e.: player) from campaign > timeline > channel
     @method removeBlockFromTimelineChannel
     @param {Number} i_block_id
     @return none
     **/
    removeBlockFromTimelineChannel: function (i_block_id) {
        var self = this;
        var status = self.m_msdb.table_campaign_timeline_chanel_players().openForDelete(i_block_id);
    },

    /**
     Remove all blocks (i.e.: players) from campaign > timeline > channel
     @method removeBlocksFromTimelineChannel
     @param {Number} i_block_id
     @return none
     **/
    removeBlocksFromTimelineChannel: function (i_campaign_timeline_chanel_id) {
        var self = this;
        $(self.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
            if (recCampaignTimelineChannelPlayer['campaign_timeline_chanel_id'] == i_campaign_timeline_chanel_id) {
                var status = self.m_msdb.table_campaign_timeline_chanel_players().openForDelete(campaign_timeline_chanel_player_id);
            }
        });
    },

    /**
     Remove a timeline from sequences
     @method removeTimelineFromSequences
     @param {Number} i_timeline_id
     @return none
     **/
    removeTimelineFromSequences: function (i_campaign_timeline_id) {
        var self = this;
        $(self.m_msdb.table_campaign_timeline_sequences().getAllPrimaryKeys()).each(function (k, campaign_timeline_sequence_id) {
            var recCampaignTimelineSequence = self.m_msdb.table_campaign_timeline_sequences().getRec(campaign_timeline_sequence_id);
            if (recCampaignTimelineSequence['campaign_timeline_id'] == i_campaign_timeline_id) {
                self.m_msdb.table_campaign_timeline_sequences().openForDelete(campaign_timeline_sequence_id);
            }
        });
    },

    /**
     Remove board template from timeline
     @method removeBoardTemplateFromTimeline
     @param {Number} i_timeline_id
     @return {Number} campaign_timeline_board_template_id
     **/
    removeBoardTemplateFromTimeline: function (i_timeline_id) {
        var self = this;
        var campaign_timeline_board_template_id = pepper.getTemplatesOfTimeline(i_timeline_id)[0];
        self.m_msdb.table_campaign_timeline_board_templates().openForDelete(campaign_timeline_board_template_id);
        return campaign_timeline_board_template_id;
    },

    /**
     Remove board template
     @method removeBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     **/
    removeBoardTemplate: function (i_board_template_id) {
        var self = this;
        self.m_msdb.table_board_templates().openForDelete(i_board_template_id);
        return i_board_template_id;
    },

    /**
     Remove board template viewers
     @method removeBoardTemplateViewers
     @param {Number} i_board_template_id
     @return {Array} boardTemplateViewerIDs
     **/
    removeBoardTemplateViewers: function (i_board_template_id) {
        var self = this;
        var boardTemplateViewerIDs = [];

        $(pepper.m_msdb.table_board_template_viewers().getAllPrimaryKeys()).each(function (k, board_template_viewer_id) {
            var recBoardTemplateViewers = self.m_msdb.table_board_template_viewers().getRec(board_template_viewer_id);
            if (recBoardTemplateViewers['board_template_id'] == i_board_template_id) {
                var a = self.m_msdb.table_board_template_viewers().openForDelete(board_template_viewer_id);
                boardTemplateViewerIDs.push(board_template_viewer_id);
            }
        });
        return boardTemplateViewerIDs;
    },

    /**
     Remove board template viewer
     @method removeBoardTemplateViewer
     @param {Number} i_board_template_id
     @param {Number} i_board_template_viewer_id
     **/
    removeBoardTemplateViewer: function (i_board_template_id, i_board_template_viewer_id) {
        var self = this;
        self.m_msdb.table_board_template_viewers().openForDelete(i_board_template_viewer_id);
    },

    /**
     Remove board template viewers
     @method removeTimelineBoardViewerChannels
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    removeTimelineBoardViewerChannels: function (i_campaign_timeline_board_template_id) {
        var self = this;

        $(self.m_msdb.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {
            var recCampaignTimelineViewerChanels = self.m_msdb.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
            if (recCampaignTimelineViewerChanels['campaign_timeline_board_template_id'] == i_campaign_timeline_board_template_id) {
                self.m_msdb.table_campaign_timeline_board_viewer_chanels().openForDelete(campaign_timeline_board_viewer_chanel_id);
            }
        });
    },

    /**
     Remove the association between the screen division (aka viewer) and all channels that are assigned with that viewer
     @method removeTimelineBoardViewerChannel
     @param {Number} i_campaign_timeline_board_template_id
     @return {Number} return the channel that was de-associated with viewer
     **/
    removeTimelineBoardViewerChannel: function (i_board_template_viewer_id) {
        var self = this;
        var campaign_timeline_chanel_id = -1;
        $(self.m_msdb.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {
            var recCampaignTimelineViewerChanels = self.m_msdb.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
            if (recCampaignTimelineViewerChanels['board_template_viewer_id'] == i_board_template_viewer_id) {
                campaign_timeline_chanel_id = recCampaignTimelineViewerChanels['campaign_timeline_chanel_id'];
                self.m_msdb.table_campaign_timeline_board_viewer_chanels().openForDelete(campaign_timeline_board_viewer_chanel_id);
            }
        });
        return campaign_timeline_chanel_id;
    },

    /**
     Remove a channel from a timeline
     @method removeChannelFromTimeline
     @param {Number} i_channel_id
     @return {Boolean} status
     **/
    removeChannelFromTimeline: function (i_channel_id) {
        var self = this;
        return self.m_msdb.table_campaign_timeline_chanels().openForDelete(i_channel_id);
    },

    /**
     Remove blocks (a.k.a players) from all campaign that use the specified resource_id (native id)
     @method removeBlocksWithResourceID
     @param {Number} i_resource_id
     @return none
     **/
    removeBlocksWithResourceID: function (i_resource_id) {
        var self = this;
        // self.m_msdb.table_resources().openForDelete(i_resource_id);

        $(self.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
            var playerData = recCampaignTimelineChannelPlayer['player_data'];
            var xPlayerData = x2js.xml_str2json(playerData);
            var resourceID = undefined;
            try {
                resourceID = xPlayerData['Player']['Data']['Resource']['_hResource'];
            } catch (e) {
            }
            if (resourceID != undefined && resourceID == i_resource_id) {
                pepper.removeBlockFromTimelineChannel(campaign_timeline_chanel_player_id);
            }
        });
    },

    /**
     Remove a timeline from a campaign.
     @method removeTimelineFromCampaign
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    removeTimelineFromCampaign: function (i_campaign_timeline_id) {
        var self = this;
        self.m_msdb.table_campaign_timelines().openForDelete(i_campaign_timeline_id);
        pepper.fire(Pepper['TIMELINE_DELETED'], self, null, i_campaign_timeline_id);
    },

    /**
     Remove a timeline from a campaign.
     @method removeResource
     @param {Number} i_resource_id
     @return none
     **/
    removeResource: function (i_resource_id) {
        var self = this;
        self.m_msdb.table_resources().openForDelete(i_resource_id);
    },

    /**
     Get a list of all campaigns per the account
     @method getCampaignIDs
     @return {Array} campaigns
     **/
    getCampaignIDs: function () {
        var self = this;
        var campaigns = [];
        $(self.m_msdb.table_campaigns().getAllPrimaryKeys()).each(function (k, campaign_id) {
            campaigns.push(campaign_id);
        });
        return campaigns;
    },

    /**
     Get a campaign table record for the specified i_campaign_id.
     @method getCampaignRecord
     @param {Number} i_campaign_id
     @return {Object} foundCampaignRecord
     **/
    getCampaignRecord: function (i_campaign_id) {
        var self = this;
        return self.m_msdb.table_campaigns().getRec(i_campaign_id);
    },

    /**
     Set a campaign table record for the specified i_campaign_id.
     The method uses generic key / value fields so it can set any part of the record.
     @method setCampaignRecord
     @param {Number} i_campaign_id
     @param {Object} i_key
     @param {String} i_value
     @return {Object} foundCampaignRecord
     **/
    setCampaignRecord: function (i_campaign_id, i_key, i_value) {
        var self = this;
        self.m_msdb.table_campaigns().openForEdit(i_campaign_id);
        var recCampaign = self.m_msdb.table_campaigns().getRec(i_campaign_id);
        recCampaign[i_key] = i_value;
    },

    /**
     Returns all of the campaign IDs that all stations belonging to account are associated with
     @method getStationCampaignIDs
     @return {Array} array of campaign IDs
     **/
    getStationCampaignIDs: function () {
        var self = this;
        var campaignIDs = [];
        $(self.m_msdb.table_branch_stations().getAllPrimaryKeys()).each(function (k, branch_station_id) {
            var recBranchStation = self.m_msdb.table_branch_stations().getRec(branch_station_id);
            var campaign_board_id = recBranchStation['campaign_board_id'];
            campaignIDs.push(self.getCampaignIdFromCampaignBoardId(campaign_board_id));
        });
        return campaignIDs;
    },

    /**
     Returns the campaign id that a station is bound to
     @method getStationCampaignID
     @param {Number} i_native_station_id
     @return {Number} campaign_id
     **/
    getStationCampaignID: function (i_native_station_id) {
        var self = this;
        var campaignID = -1;
        $(self.m_msdb.table_branch_stations().getAllPrimaryKeys()).each(function (k, branch_station_id) {
            var recBranchStation = self.m_msdb.table_branch_stations().getRec(branch_station_id);
            if (recBranchStation['native_id'] == i_native_station_id) {
                var campaign_board_id = recBranchStation['campaign_board_id'];
                campaignID = self.getCampaignIdFromCampaignBoardId(campaign_board_id);
            }
        });
        return campaignID;
    },

    /**
     Set a station so its bound to campaign_id
     @method SetStationCampaignID
     @param {Number} i_native_station_id
     @param {Number} i_campaign_id
     **/
    setStationCampaignID: function (i_native_station_id, i_campaign_id) {
        var self = this;
        $(self.m_msdb.table_branch_stations().getAllPrimaryKeys()).each(function (k, branch_station_id) {
            var recBranchStation = self.m_msdb.table_branch_stations().getRec(branch_station_id);
            if (recBranchStation['native_id'] == i_native_station_id) {
                self.m_msdb.table_branch_stations().openForEdit(branch_station_id);
                var recBranchStationEdit = self.m_msdb.table_branch_stations().getRec(branch_station_id);
                var campaign_board_id = self.getCampaignBoardIdFromCampaignId(i_campaign_id);
                recBranchStationEdit.campaign_board_id = campaign_board_id;
            }
        });
    },

    /**
     Remove station, delete it from internal msdb and push to server on save
     @method removeStation
     @param {Number} i_station
     **/
    removeStation: function (i_native_station_id) {
        var self = this;
        $(self.m_msdb.table_branch_stations().getAllPrimaryKeys()).each(function (k, branch_station_id) {
            var recBranchStation = self.m_msdb.table_branch_stations().getRec(branch_station_id);
            if (recBranchStation['native_id'] == i_native_station_id) {
                self.m_msdb.table_branch_stations().openForDelete(branch_station_id);
                self.m_msdb.table_station_ads().openForDelete(branch_station_id);
            }
        });
    },

    /**
     Get the type of a resource (png/jpg...) for specified native_id
     @method getResourceType
     @param {Number} i_resource_id
     @return {String} resourceType
     **/
    getResourceType: function (i_resource_id) {
        var self = this;
        var recResource = self.m_msdb.table_resources().getRec(i_resource_id);
        return recResource['resource_type'];
    },

    /**
     Get the name of a resource from the resources table using it's native_id
     @method getResourceName
     @param {Number} i_resource_id
     @return {Number} resourceName
     **/
    getResourceName: function (i_resource_id) {
        var self = this;
        var recResource = self.m_msdb.table_resources().getRec(i_resource_id);
        return recResource['resource_name'];
    },

    /**
     Upload new resources onto the remote server and return matching ids.
     The element id is of an HTML id of a multi-part upload element.
     @method uploadResources
     @param {String} i_elementID
     @return {Array} list of resources created from newly attached files
     **/
    uploadResources: function (i_elementID) {
        var self = this;
        var resourceList = self.m_loaderManager.createResources(document.getElementById(i_elementID));
        return resourceList;
    },

    /**
     Update a timeline's duration which is set as the total sum of all blocks within the longest running channel
     @method calcTimelineTotalDuration
     @param {Number} i_campaign_timeline_id
     @return none
     **/
    calcTimelineTotalDuration: function (i_campaign_timeline_id) {
        var self = this;

        var longestChannelDuration = 0;
        // Get all timelines
        $(self.m_msdb.table_campaign_timelines().getAllPrimaryKeys()).each(function (k, campaign_timeline_id) {
            if (campaign_timeline_id == i_campaign_timeline_id) {
                // get all channels that belong to timeline
                $(self.m_msdb.table_campaign_timeline_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_id) {
                    var recCampaignTimelineChannel = self.m_msdb.table_campaign_timeline_chanels().getRec(campaign_timeline_chanel_id);
                    if (campaign_timeline_id == recCampaignTimelineChannel['campaign_timeline_id']) {

                        var timelineDuration = 0;
                        // get all players / resources that belong timeline
                        $(self.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
                            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
                            if (campaign_timeline_chanel_id == recCampaignTimelineChannelPlayer['campaign_timeline_chanel_id']) {
                                // log(campaign_timeline_chanel_player_id + ' ' + recCampaignTimelineChannelPlayer['player_duration']);
                                timelineDuration += parseFloat(recCampaignTimelineChannelPlayer['player_duration']);
                                if (timelineDuration > longestChannelDuration)
                                    longestChannelDuration = timelineDuration;
                            }
                        });
                    }
                });
            }
        });
        pepper.setCampaignTimelineRecord(i_campaign_timeline_id, 'timeline_duration', longestChannelDuration);
        pepper.fire(Pepper['TIMELINE_LENGTH_CHANGED'], self, null, longestChannelDuration);
    },

    /**
     Set a timeline's total duration
     @method setTimelineTotalDuration
     @param {Number} i_campaign_timeline_id
     @param {Number} i_totalDuration
     **/
    setTimelineTotalDuration: function (i_campaign_timeline_id, i_totalDuration) {
        var self = this;
        self.m_msdb.table_campaign_timelines().openForEdit(i_campaign_timeline_id);
        var recCampaignTimeline = self.m_msdb.table_campaign_timelines().getRec(i_campaign_timeline_id);
        recCampaignTimeline['timeline_duration'] = i_totalDuration;
    },

    /**
     Get a timeline's duration which is set as the total sum of all blocks within the longest running channel
     @method getTimelineTotalDuration
     @param {Number} i_campaign_timeline_id
     @return {Number} length in seconds
     **/
    getTimelineTotalDuration: function (i_campaign_timeline_id) {
        var self = this;
        var recCampaignTimeline = self.m_msdb.table_campaign_timelines().getRec(i_campaign_timeline_id);
        if (!recCampaignTimeline)
            return 0;
        return recCampaignTimeline['timeline_duration'];
    },

    /**
     Set a block (a.k.a player) on the timeline_channel to a specified length in total seconds.
     @method setBlockTimelineChannelBlockLength
     @param {Number} i_campaign_timeline_chanel_player_id {string} plyer / block id
     @param {Number} i_hours total hours to play
     @param {Number} i_minutes total minutes to play
     @param {Number} i_seconds total seconds to play
     @return none
     **/
    setBlockTimelineChannelBlockLength: function (i_campaign_timeline_chanel_player_id, i_hours, i_minutes, i_seconds) {
        var self = this;

        var totalSecInMin = 60
        var totalSecInHour = totalSecInMin * 60
        var totalSeconds = parseInt(i_seconds) + (parseInt(i_minutes) * totalSecInMin) + (parseInt(i_hours) * totalSecInHour)

        $(self.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
            if (campaign_timeline_chanel_player_id == i_campaign_timeline_chanel_player_id) {
                self.m_msdb.table_campaign_timeline_chanel_players().openForEdit(campaign_timeline_chanel_player_id);
                var recPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
                recPlayer.player_duration = totalSeconds;
            }
        });
        var returnData = {
            campaignTimelineChanelPlayerID: i_campaign_timeline_chanel_player_id,
            totalSeconds: totalSeconds
        }
        pepper.fire(Pepper['BLOCK_LENGTH_CHANGED'], self, null, returnData);
    },

    /**
     Get all the block IDs of a particular channel.
     Push them into an array so they are properly sorted by player offset time.
     @method getChannelBlocksIDs
     @param {Number} i_campaign_timeline_chanel_id
     @return {Array} foundBlocks
     **/
    getChannelBlocks: function (i_campaign_timeline_chanel_id) {
        var self = this;
        var foundBlocks = [];
        $(pepper.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
            if (i_campaign_timeline_chanel_id == recCampaignTimelineChannelPlayer['campaign_timeline_chanel_id']) {
                foundBlocks.push(campaign_timeline_chanel_player_id);
            }
        });
        return foundBlocks;
    },

    /**
     Get a block's (a.k.a player) total hours / minutes / seconds playback length on the timeline_channel.
     @method getBlockTimelineChannelBlockLength
     @param {Number} i_campaign_timeline_chanel_player_id
     @return {Object} playbackLength as a json object with keys of hours minutes seconds
     **/
    getBlockTimelineChannelBlockLength: function (i_campaign_timeline_chanel_player_id) {
        var self = this;
        var seconds = 0;
        var minutes = 0;
        var hours = 0;
        var totalInSeconds = 0;

        var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(i_campaign_timeline_chanel_player_id);
        var totalSeconds = recCampaignTimelineChannelPlayer['player_duration'];
        totalInSeconds = totalSeconds;
        if (totalSeconds >= 3600) {
            hours = Math.floor(totalSeconds / 3600);
            totalSeconds = totalSeconds - (hours * 3600);
        }
        if (totalSeconds >= 60) {
            minutes = Math.floor(totalSeconds / 60);
            seconds = totalSeconds - (minutes * 60);
        }
        if (hours == 0 && minutes == 0)
            seconds = totalSeconds;
        var playbackLength = {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            totalInSeconds: totalInSeconds
        }
        return playbackLength;
    },

    /**
     Get a player_id record from msdb by player_id primary key.
     @method getCampaignTimelineChannelPlayerRecord
     @param {Number} i_player_id
     @return {Object} player record
     **/
    getCampaignTimelineChannelPlayerRecord: function (i_player_id) {
        var self = this;
        return self.m_msdb.table_campaign_timeline_chanel_players().getRec(i_player_id);
    },

    /**
     Set a player_id record in msdb on key with value
     The method uses generic key / value fields so it can set any part of the record.
     @method setCampaignTimelineChannelPlayerRecord
     @param {Number} i_player_id
     @param {Number} i_key
     @param {String} i_value
     @return none
     **/
    setCampaignTimelineChannelPlayerRecord: function (i_player_id, i_key, i_value) {
        var self = this;
        self.m_msdb.table_campaign_timeline_chanel_players().openForEdit(i_player_id);
        var recPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(i_player_id);
        recPlayer[i_key] = i_value;
    },

    /**
     Get a channel_id record from table channels msdb by channel_id
     @method getCampaignTimelineChannelRecord
     @param {Number} i_channel_id
     @return {Object} channel record
     **/
    getCampaignTimelineChannelRecord: function (i_channel_id) {
        var self = this;
        return self.m_msdb.table_campaign_timeline_chanels().getRec(i_channel_id);
    },

    /**
     Set a channel_id record in channels table using key and value
     The method uses generic key / value fields so it can set any part of the record.
     @method setCampaignTimelineChannelRecord
     @param {Number} i_channel_id
     @param {Number} i_key
     @param {String} i_value
     @return none
     **/
    setCampaignTimelineChannelRecord: function (i_channel_id, i_key, i_value) {
        var self = this;
        self.m_msdb.table_campaign_timeline_chanels().openForEdit(i_channel_id);
        var recChannel = self.m_msdb.table_campaign_timeline_chanels().getRec(i_channel_id);
        recChannel[i_key] = i_value;
    },

    /**
     Get a timeline record from msdb using i_campaign_timeline_id primary key.
     @method getCampaignTimelineRecord
     @param {Number} i_campaign_timeline_id
     @return {Object} player record
     **/
    getCampaignTimelineRecord: function (i_campaign_timeline_id) {
        var self = this;
        return self.m_msdb.table_campaign_timelines().getRec(i_campaign_timeline_id);
    },

    /**
     Get all timeline ids for specified campaign
     @method getCampaignTimelines
     @param {Number} i_campaign_id
     @return {Array} timeline ids
     **/
    getCampaignTimelines: function (i_campaign_id) {
        var self = this;

        var timelineIDs = [];
        $(self.m_msdb.table_campaign_timelines().getAllPrimaryKeys()).each(function (k, campaign_timeline_id) {
            var recCampaignTimeline = self.m_msdb.table_campaign_timelines().getRec(campaign_timeline_id);
            if (recCampaignTimeline['campaign_id'] == i_campaign_id) {
                timelineIDs.push(campaign_timeline_id);
            }
        });
        return timelineIDs;
    },

    /**
     Build screenProps json object with all viewers and all of their respective attributes for the given timeline_id / template_id
     @method getTemplateViewersScreenProps
     @param {Number} i_campaign_timeline_id
     @param {Number} i_campaign_timeline_board_template_id
     @return {Object} screenProps all viewers and all their properties
     **/
    getTemplateViewersScreenProps: function (i_campaign_timeline_id, i_campaign_timeline_board_template_id) {
        var self = this;
        var counter = -1;
        var screenProps = {};

        $(pepper.m_msdb.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {

            var recCampaignTimelineBoardViewerChanel = self.m_msdb.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
            if (recCampaignTimelineBoardViewerChanel['campaign_timeline_board_template_id'] == i_campaign_timeline_board_template_id) {
                var recBoardTemplateViewer = self.m_msdb.table_board_template_viewers().getRec(recCampaignTimelineBoardViewerChanel['board_template_viewer_id']);
                // log(i_campaign_timeline_board_template_id + ' ' + recBoardTemplateViewer['board_template_viewer_id']);
                counter++;
                screenProps['sd' + counter] = {};
                screenProps['sd' + counter]['campaign_timeline_board_viewer_id'] = recBoardTemplateViewer['board_template_viewer_id'];
                screenProps['sd' + counter]['campaign_timeline_id'] = i_campaign_timeline_id;
                screenProps['sd' + counter]['x'] = recBoardTemplateViewer['pixel_x'];
                screenProps['sd' + counter]['y'] = recBoardTemplateViewer['pixel_y'];
                screenProps['sd' + counter]['w'] = recBoardTemplateViewer['pixel_width'];
                screenProps['sd' + counter]['h'] = recBoardTemplateViewer['pixel_height'];
            }
        });

        return screenProps;
    },

    /**
     Set a timeline records in msdb using i_campaign_timeline_id primary key.
     The method uses generic key / value fields so it can set any part of the record.
     @method setCampaignTimelineRecord
     @param {number} i_player_id
     @param {string} i_key the key to set
     @param {Object} i_value the value to set
     @return none
     **/
    setCampaignTimelineRecord: function (i_campaign_timeline_id, i_key, i_value) {
        var self = this;
        self.m_msdb.table_campaign_timelines().openForEdit(i_campaign_timeline_id);
        var recTimeline = self.m_msdb.table_campaign_timelines().getRec(i_campaign_timeline_id);
        recTimeline[i_key] = i_value;
    },

    /**
     Use a viewer_id to reverse enumerate over the mapping of viewers to channels via:
     campaign_timeline_viewer_chanels -> table_campaign_timeline_chanels
     so we can find the channel assigned to the viewer_id provided.
     @method getChannelIdFromCampaignTimelineBoardViewer
     @param {Number} i_campaign_timeline_board_viewer_id
     @param {Number} i_campaign_timeline_id
     @return {Object} recCampaignTimelineViewerChanelsFound
     **/
    getChannelIdFromCampaignTimelineBoardViewer: function (i_campaign_timeline_board_viewer_id, i_campaign_timeline_id) {
        var self = this;

        var recCampaignTimelineViewerChanelsFound = undefined;

        $(self.m_msdb.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {
            var recCampaignTimelineViewerChanels = self.m_msdb.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);

            // if true, we found the viewer selected uner table campaign_timeline_viewer_chanels
            if (recCampaignTimelineViewerChanels['board_template_viewer_id'] == i_campaign_timeline_board_viewer_id) {

                $(self.m_msdb.table_campaign_timeline_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_id) {
                    var recCampaignTimelineChannel = self.m_msdb.table_campaign_timeline_chanels().getRec(campaign_timeline_chanel_id);

                    // if true, we found the channel the viewer was assined to as long as it is part of the current selected timeline
                    if (recCampaignTimelineViewerChanels['campaign_timeline_chanel_id'] == campaign_timeline_chanel_id && recCampaignTimelineChannel['campaign_timeline_id'] == i_campaign_timeline_id) {
                        // log('selected: timeline_id ' + i_campaign_timeline_id + ' view_id ' + i_campaign_timeline_board_viewer_id + ' on channel_id ' + recCampaignTimelineViewerChanels['campaign_timeline_chanel_id']);
                        recCampaignTimelineViewerChanelsFound = recCampaignTimelineViewerChanels;
                    }
                });
            }
        });

        return recCampaignTimelineViewerChanelsFound;
    },

    /**
     Sample function to demonstrate how to enumerate over records to query for specified template_id
     @method populateBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    populateBoardTemplate: function (i_campaign_timeline_board_template_id) {
        var self = this;

        var recCampaignTimelineBoardTemplate = self.m_msdb.table_campaign_timeline_board_templates().getRec(i_campaign_timeline_board_template_id);

        // Get global board > board template so we can get the total width / height resolution of the board

        var recBoardTemplate = self.m_msdb.table_board_templates().getRec(recCampaignTimelineBoardTemplate['board_template_id']);
        var recBoard = self.m_msdb.table_boards().getRec(recBoardTemplate['board_id']);

        $(self.m_msdb.table_campaign_timeline_board_viewer_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_board_viewer_chanel_id) {
            var recCampaignTimelineBoardViewerChanel = self.m_msdb.table_campaign_timeline_board_viewer_chanels().getRec(campaign_timeline_board_viewer_chanel_id);
            if (recCampaignTimelineBoardViewerChanel['campaign_timeline_board_template_id'] == i_campaign_timeline_board_template_id) {
                var recBoardTemplateViewer = self.m_msdb.table_board_template_viewers().getRec(recCampaignTimelineBoardViewerChanel['board_template_viewer_id']);
                // log(i_campaign_timeline_board_template_id);
            }
        });
    },

    /**
     The jQuery.Event constructor is exposed and can be used when calling trigger. The new operator is optional.
     @method event
     @param {Event} i_event
     @param {Object} i_context
     @param {Object} i_caller
     @param {Object} i_data
     @return none.

     event: function (i_event, i_context, i_caller, i_data) {
        return $.Event(i_event, {context: i_context, caller: i_caller, edata: i_data});
    },
     **/

    /**
     Sample function to demonstrate how to enumerate over records to query related tables of a campaign
     @method populateBoardTemplate
     @param {Number} i_campaign_timeline_board_template_id
     @return none
     **/
    populateCampaign: function () {
        var self = this;

        // demo campaign_id
        var campaign_id = 1;

        // Get all timelines
        $(self.m_msdb.table_campaign_timelines().getAllPrimaryKeys()).each(function (k, campaign_timeline_id) {

            var recCampaignTimeline = self.m_msdb.table_campaign_timelines().getRec(campaign_timeline_id);

            // if timeline belongs to selected campaign
            if (recCampaignTimeline['campaign_id'] == campaign_id) {

                // get all campaign timeline board templates (screen divison inside output, gets all outputs, in our case only 1)
                $(self.m_msdb.table_campaign_timeline_board_templates().getAllPrimaryKeys()).each(function (k, table_campaign_timeline_board_template_id) {
                    var recCampaignTimelineBoardTemplate = self.m_msdb.table_campaign_timeline_board_templates().getRec(table_campaign_timeline_board_template_id);
                    if (recCampaignTimelineBoardTemplate['campaign_timeline_id'] == campaign_timeline_id) {
                        // log(recCampaignTimelineBoardTemplate['campaign_timeline_id']);
                        self._populateBoardTemplate(table_campaign_timeline_board_template_id);
                    }
                });

                // get all channels that belong to timeline
                $(self.m_msdb.table_campaign_timeline_chanels().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_id) {
                    var recCampaignTimelineChannel = self.m_msdb.table_campaign_timeline_chanels().getRec(campaign_timeline_chanel_id);
                    if (campaign_timeline_id == recCampaignTimelineChannel['campaign_timeline_id']) {

                        // get all players / resources that belong timeline
                        $(self.m_msdb.table_campaign_timeline_chanel_players().getAllPrimaryKeys()).each(function (k, campaign_timeline_chanel_player_id) {
                            var recCampaignTimelineChannelPlayer = self.m_msdb.table_campaign_timeline_chanel_players().getRec(campaign_timeline_chanel_player_id);
                            if (campaign_timeline_chanel_id == recCampaignTimelineChannelPlayer['campaign_timeline_chanel_id']) {
                                log(campaign_timeline_chanel_player_id);
                            }
                        });
                    }
                });
            }
        });
    }
}