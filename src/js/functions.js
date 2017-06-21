'use strict';

function dateToUTC (dateObject) {
    var utcOffset = dateObject.getTimezoneOffset() * 60 * 1000;

    return +dateObject - utcOffset;
};

function utcToDate (utcTimestamp) {
    var dateObject = new Date(utcTimestamp);
    var utcOffset = dateObject.getTimezoneOffset()

    dateObject.setMinutes(dateObject.getMinutes() + utcOffset);

    return dateObject;
};

module.exports = { dateToUTC, utcToDate };
