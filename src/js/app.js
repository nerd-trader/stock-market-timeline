'use strict';

require('../css/reset.css');
require('../../node_modules/vis/dist/vis.min.css');
require('../css/style.css');

let functions = require('./functions.js');
let markets = require('./markets.js');

import moment from 'moment-timezone';
import vis from 'vis';
import _ from 'lodash';

var oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);
var threeDaysFromNow = new Date();
threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

let timeline_range_start = functions.dateToUTC(oneDayAgo);
let timeline_range_end = functions.dateToUTC(threeDaysFromNow);

var containerElement = document.getElementById('timeline');
var todayElement = document.getElementById('today');

var timeline;

var visTimelineOptions = {
    editable: false,
    selectable: false,
    stack: false,
    rtl: true, // Because the sun rises in the East
    margin: {
        item : {
            horizontal : 0,
            vertical: 8
        },
        axis: 0
    },
    zoomMax: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks in milliseconds
    zoomMin: 1000 * 60 * 60 * 24          // one day in milliseconds
};

function utcTimeToLocalDate (hoursMinutes, date, timezone) {
    var now = new Date(date);
    var array = hoursMinutes.split(':');
    var hours = array[0], minutes = array[1];

    if (moment(now).tz(timezone).isDST()) {
        hours--;
    }

    if (hours > 23) {
        now.setDate(now.getDate() + 1);
        hours = hours - 24;
    } else if (hours < 0) {
        now.setDate(now.getDate() - 1);
        hours = hours + 24;
    }

    var utcDateString = now.getFullYear() + '-' +
                        ('0'+(now.getMonth() + 1)).slice(-2) + '-' +
                        ('0'+now.getDate()).slice(-2) + 'T' +
                        ('0'+hours).slice(-2) + ':' + minutes + ':00.000Z';

    return new Date(utcDateString);
}

function printEarningsTooltip (symbols, all) {
    if (all || symbols.length < 2)
        return symbols.join(', ');
    else
        return '' + symbols.length;
}


// Each market represents a single group
var groups = [];
var TimelineDataSet = [];

for (let i = 0, ilen = markets.length; i < ilen; i++) {
    let market = markets[i];

    groups.push({
        id: market._id,
        content: market.name
    });

}
    // This needs to be here because vis.js puts a wrong top margin for the last row
    groups.push({
        id: '__Padding_Bottom__',
        content: ''
    });


let gData = new vis.DataSet(TimelineDataSet);
timeline = new vis.Timeline(containerElement, gData, visTimelineOptions);

timeline.setGroups(groups);

timeline.setWindow(
    functions.utcToDate(timeline_range_start),
    functions.utcToDate(timeline_range_end)
);

timeline.on('rangechanged', _.debounce(function(range){
    timeline_range_start = functions.dateToUTC(range.start);
    timeline_range_end = functions.dateToUTC(range.end);

    let dateEnd = functions.utcToDate(timeline_range_end);
    dateEnd.setDate(dateEnd.getDate() + 1);

    for (let i = 0, ilen = markets.length; i < ilen; i++) {
        let market = markets[i];

        gData.remove(
            gData.get({
                filter: function (item) {
                    return item.group === market._id
                }
            })
        );

        let add = [];

        let dateStart = functions.utcToDate(timeline_range_start);
        dateStart.setDate(dateStart.getDate() - 1);

        while (dateStart < dateEnd) {
            dateStart.setDate(dateStart.getDate() + 1);

            let day = dateStart.getDay();

            for (let h = 0, hlen = market.hours.length; h < hlen; h++) {
                let hours = market.hours[h];

                if (day > 0 && day < 6) { // skip Sat and Sun
                    add[add.length] = {
                        group: market._id,
                        start: utcTimeToLocalDate(hours[0], +dateStart, market.timezone),
                        end: utcTimeToLocalDate(hours[1], +dateStart, market.timezone),
                        content: market._id,
                        className: 'market market-' + market._id.toLowerCase()
                    };
                }
            }
        }

        gData.add(add);
    }
}, 99));

// Handle the click on the "Today" button
todayElement.addEventListener('click', function() {
    var bod = new Date();
    bod.setHours(0);
    bod.setMinutes(0);
    bod.setSeconds(0);
    bod.setMilliseconds(0);

    var eod = new Date();
    eod.setHours(23);
    eod.setMinutes(59);
    eod.setSeconds(59);
    eod.setMilliseconds(999);

    timeline.setWindow(bod, eod);
});
