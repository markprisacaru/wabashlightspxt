"use strict";
/**
 * A workspace implementation that uses IndexedDB directly (bypassing PouchDB), to support WKWebview where PouchDB
 * doesn't work.
 */
Object.defineProperty(exports, "__esModule", { value: true });
;
var TEXTS_TABLE = "texts";
var HEADERS_TABLE = "headers";
var KEYPATH = "id";
var _db;
function getDbAsync() {
    if (_db) {
        return Promise.resolve(_db);
    }
    _db = new pxt.BrowserUtils.IDBWrapper("__pxt_idb_workspace", 1, function (ev, r) {
        var db = r.result;
        db.createObjectStore(TEXTS_TABLE, { keyPath: KEYPATH });
        db.createObjectStore(HEADERS_TABLE, { keyPath: KEYPATH });
    });
    return _db.openAsync()
        .catch(function (e) {
        pxt.reportException(e);
        return Promise.reject(e);
    })
        .then(function () { return _db; });
}
function listAsync() {
    return getDbAsync()
        .then(function (db) {
        return db.getAllAsync(HEADERS_TABLE);
    });
}
function getAsync(h) {
    return getDbAsync()
        .then(function (db) {
        return db.getAsync(TEXTS_TABLE, h.id);
    })
        .then(function (res) {
        return Promise.resolve({
            header: h,
            text: res.files,
            version: res._rev
        });
    });
}
function setAsync(h, prevVer, text) {
    return getDbAsync()
        .then(function (db) {
        var dataToStore = {
            id: h.id,
            files: text,
            _rev: prevVer
        };
        return (text ? db.setAsync(TEXTS_TABLE, dataToStore) : Promise.resolve())
            .then(function () {
            return db.setAsync(HEADERS_TABLE, h);
        });
    });
}
function deleteAsync(h, prevVer) {
    return getDbAsync()
        .then(function (db) {
        return db.deleteAsync(TEXTS_TABLE, h.id)
            .then(function () {
            return db.deleteAsync(HEADERS_TABLE, h.id);
        });
    });
}
function resetAsync() {
    return getDbAsync()
        .then(function (db) {
        return db.deleteAllAsync(TEXTS_TABLE)
            .then(function () {
            return db.deleteAllAsync(HEADERS_TABLE);
        });
    });
}
exports.provider = {
    getAsync: getAsync,
    setAsync: setAsync,
    deleteAsync: deleteAsync,
    listAsync: listAsync,
    resetAsync: resetAsync,
};
