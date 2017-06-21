'use strict';

let Markets = [];
const step = 100;
let o = step; // order increment; we list markets below in the order of opening

// Tokyo
Markets.push({
    _id: "TSE",
    name: "Tokyo Stock Exchange",
    timezone: "Asia/Tokyo",
    hours: [
        ['00:00', '02:30'],
        // Lunch
        ['03:30', '06:00']
    ],
    order: o += step
});

// Hong Kong
Markets.push({
    _id: "HKEX",
    name: "Hong Kong Stock Exchange",
    timezone: "Asia/Hong_Kong",
    hours: [
        ['01:30', '04:00'],
        // Lunch
        ['05:00', '08:00']
    ],
    order: o += step
});

// Frankfurt
Markets.push({
    _id: "FSX",
    name: "Frankfurt Stock Exchange",
    timezone: "Europe/Berlin",
    hours: [
        ['07:00', '19:00']
    ],
    order: o += step
});

// London
Markets.push({
    _id: "LSE",
    name: "London Stock Exchange",
    timezone: "Europe/London",
    hours: [
        ['08:00', '16:30']
    ],
    order: o += step
});

// New York
Markets.push({
    _id: "NYSE",
    name: "New York Stock Exchange",
    timezone: "America/New_York",
    hours: [
        // ['08:30', '09:00'], // Pre-opening session
        ['09:00', '14:30'], // Pre-market
        ['14:30', '21:00'], // Normal hours
        ['21:00', '25:00']  // After hours
    ],
    order: o += step
});

// NASDAQ has the ~same~ hours as NYSE => no need to show on the timeline
/*
Markets.push({
    _id: "NASDAQ",
    name: "Nasdaq Stock Market",
    timezone: "America/New_York",
    hours: [
        // ['08:30', '09:00'], // Pre-opening session
        ['09:00', '14:30'], // Pre-market
        ['14:30', '21:00'], // Normal hours
        ['21:00', '25:00']  // After hours
    ],
    order: o += step
});
*/

module.exports = Markets;
