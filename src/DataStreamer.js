"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataStreamer = /** @class */ (function () {
    function DataStreamer() {
    }
    DataStreamer.getData = function (callback) {
        var request = new XMLHttpRequest();
        request.open('GET', DataStreamer.API_URL, false);
        request.onload = function () {
            if (request.status === 200) {
                callback(JSON.parse(request.responseText));
            }
            else {
                alert('Request failed');
            }
        };
        request.send();
    };
    DataStreamer.API_URL = 'http://localhost:8080/query?id=1';
    return DataStreamer;
}());
exports.default = DataStreamer;
