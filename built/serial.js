"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var nodeutil = require("./nodeutil");
var U = pxt.Util;
function requireSerialPort(install) {
    return nodeutil.lazyRequire("serialport", install);
}
function isInstalled() {
    return !!requireSerialPort(false);
}
exports.isInstalled = isInstalled;
function monitorSerial(onData) {
    if (!pxt.appTarget.serial || !pxt.appTarget.serial.log)
        return;
    if (pxt.appTarget.serial.useHF2) {
        return;
    }
    var serialPort = requireSerialPort(true);
    if (!serialPort)
        return;
    pxt.log('serial: monitoring ports...');
    var serialPorts = {};
    function close(info) {
        console.log('serial: closing ' + info.pnpId);
        delete serialPorts[info.pnpId];
    }
    function open(info) {
        console.log("serial: connecting to " + info.comName + " by " + info.manufacturer + " (" + info.pnpId + ")");
        serialPorts[info.pnpId] = info;
        info.port = new serialPort(info.comName, {
            baudRate: 115200,
            autoOpen: false
        }); // this is the openImmediately flag [default is true]
        info.port.open(function (error) {
            if (error) {
                console.log('failed to open: ' + error);
                close(info);
            }
            else {
                console.log("serial: connected to " + info.comName + " by " + info.manufacturer + " (" + info.pnpId + ")");
                info.opened = true;
                info.port.on('data', function (buffer) { return onData(info, buffer); });
                info.port.on('error', function () { close(info); });
                info.port.on('close', function () { close(info); });
            }
        });
    }
    var vendorFilter = pxt.appTarget.serial.vendorId ? parseInt(pxt.appTarget.serial.vendorId, 16) : undefined;
    var productFilter = pxt.appTarget.serial.productId ? parseInt(pxt.appTarget.serial.productId, 16) : undefined;
    function filterPort(info) {
        var retVal = true;
        if (vendorFilter)
            retVal = retVal && (vendorFilter == parseInt(info.vendorId, 16));
        if (productFilter)
            retVal = retVal && (productFilter == parseInt(info.productId, 16));
        return retVal;
    }
    setInterval(function () {
        serialPort.list(function (err, ports) {
            ports.filter(filterPort)
                .filter(function (info) { return !serialPorts[info.pnpId]; })
                .forEach(function (info) { return open(info); });
        });
    }, 5000);
}
exports.monitorSerial = monitorSerial;
var Serial = /** @class */ (function () {
    function Serial(serialPort, info) {
        var _this = this;
        this.serialPort = serialPort;
        this.info = info;
        this.buf = new U.PromiseBuffer();
        this.isclosed = false;
        this.partialPos = 0;
        this.lock = new U.PromiseQueue();
        info.port = new serialPort(info.comName, {
            baudrate: 115200,
            autoOpen: false
        }); // this is the openImmediately flag [default is true]
        this.openpromise = new Promise(function (resolve, reject) {
            info.port.open(function (error) {
                if (error) {
                    console.log('failed to open: ' + error);
                    reject(error);
                }
                else {
                    console.log("serial: connected to " + info.comName + " by " + info.manufacturer + " (" + info.pnpId + ")");
                    info.opened = true;
                    info.port.on('data', function (buffer) {
                        // console.log("S: " + buffer.toString("hex"))
                        _this.buf.push(buffer);
                    });
                    info.port.on('error', function () { return _this.close(); });
                    info.port.on('close', function () { return _this.close(); });
                    resolve();
                }
            });
        });
    }
    Serial.prototype.writeAsync = function (buf) {
        var _this = this;
        if (typeof buf == "string")
            buf = new Buffer(buf, "utf8");
        return this.openpromise
            .then(function () { return _this.isclosed ? Promise.reject(new Error("closed (write)")) : null; })
            .then(function () { return new Promise(function (resolve, reject) {
            _this.info.port.write(buf, function (err) {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        }); });
    };
    Serial.prototype.readBlockingAsync = function (size) {
        var _this = this;
        var res = new Buffer(size);
        var i = 0;
        if (this.partialBuf) {
            for (i = 0; i < size; ++i) {
                if (this.partialPos >= this.partialBuf.length) {
                    this.partialBuf = null;
                    break;
                }
                res[i] = this.partialBuf[this.partialPos++];
            }
        }
        if (i >= size)
            return Promise.resolve(res);
        var loop = function () {
            return _this.readCoreAsync()
                .then(function (buf) {
                var j = 0;
                while (i < size) {
                    if (j >= buf.length)
                        break;
                    res[i++] = buf[j++];
                }
                if (i >= size) {
                    if (j < buf.length) {
                        _this.partialBuf = buf;
                        _this.partialPos = j;
                    }
                    return res;
                }
                return loop();
            });
        };
        return this.lock.enqueue("main", loop);
    };
    Serial.prototype.readCoreAsync = function () {
        if (this.isclosed)
            return Promise.reject(new Error("closed (read core)"));
        return this.buf.shiftAsync();
    };
    Serial.prototype.close = function () {
        this.buf.drain();
        if (this.isclosed)
            return;
        this.isclosed = true;
        this.info.port.close();
    };
    return Serial;
}());
var samd21 = {
    flash: [
        0xb5f02180, 0x68184b1a, 0x681c4b1a, 0x685a4b1a, 0x605a430a, 0x3c014a19,
        0x7d1dd329, 0x07ed4916, 0x2520d5fb, 0x830d35ff, 0x61cd0845, 0x800d4d14,
        0x07c97d19, 0x4913d5fc, 0x468c0005, 0x37ff1c57, 0x80194911, 0x07c97d19,
        0x2100d5fc, 0x506e5856, 0x29403104, 0x4661d1fa, 0x35403240, 0x7d198019,
        0xd5fc07c9, 0xd1eb4297, 0x30ff3001, 0xbdf0e7d3, 0x20006000, 0x20006004,
        0x41004000, 0x20006008, 0xffffa502, 0xffffa504, 0xffffa544,
    ],
    reset: [
        0x4b064a05, 0xf3bf601a, 0x4a058f4f, 0x60da4b05, 0x8f4ff3bf, 0x46c0e7fe,
        0xf02669ef, 0x20007ffc, 0x05fa0004, 0xe000ed00,
    ]
};
function sambaCmd(ch, addr, len) {
    var r = ch + addr.toString(16);
    if (len != null)
        r += "," + len.toString(16);
    return r + "#";
}
function flashSerialAsync(c) {
    var serialPort = requireSerialPort(true);
    if (!serialPort)
        return Promise.resolve();
    var listAsync = Promise.promisify(serialPort.list);
    var f = fs.readFileSync(c.args[0]);
    var blocks = pxtc.UF2.parseFile(f);
    var s;
    var writeMemAsync = function (addr, buf) {
        return s.writeAsync(sambaCmd("S", addr, buf.length))
            .then(function () { return s.writeAsync(buf); });
    };
    var pingAsync = function () {
        return s.writeAsync(sambaCmd("R", 0, 4))
            .then(function () { return s.readBlockingAsync(4); });
    };
    var currApplet = null;
    var goCmd = "";
    var saveAppletAsync = function (appl) {
        if (currApplet == appl)
            return Promise.resolve();
        currApplet = appl;
        var writeBuf = new Buffer(appl.length * 4 + 8);
        for (var i = 0; i < appl.length; i++)
            pxt.HF2.write32(writeBuf, i * 4, appl[i]);
        var code = 0x20008000 - 512;
        pxt.HF2.write32(writeBuf, appl.length * 4, 0x20007ff0); // stack
        pxt.HF2.write32(writeBuf, appl.length * 4 + 4, code + 1); // start addr (+1 for Thumb)
        goCmd = sambaCmd("G", code + writeBuf.length - 8);
        return writeMemAsync(code, writeBuf);
    };
    var runAppletAsync = function (appl) {
        return saveAppletAsync(appl)
            .then(function () { return s.writeAsync(goCmd); });
    };
    var writeBlockAsync = function (b) {
        var hd = new Buffer(8);
        pxt.HF2.write32(hd, 0, b.targetAddr);
        pxt.HF2.write32(hd, 4, 1);
        return writeMemAsync(0x20006000, Buffer.concat([hd, b.data]))
            .then(function () { return runAppletAsync(samd21.flash); })
            .then(pingAsync);
    };
    var readWordsAsync = function (addr, len) {
        return s.writeAsync(sambaCmd("R", addr, len * 4))
            .then(function () { return s.readBlockingAsync(len * 4); });
    };
    return listAsync()
        .then(function (ports) {
        var p = ports.filter(function (p) { return /Arduino|Adafruit/i.test(p.manufacturer); })[0];
        s = new Serial(serialPort, p);
        return pxt.HF2.onlyChangedBlocksAsync(blocks, readWordsAsync)
            .then(function (lessBlocks) {
            console.log("flash " + blocks.length + " pages -> " + lessBlocks.length + " pages");
            return Promise.mapSeries(lessBlocks, writeBlockAsync)
                .then(function () {
                console.log("all done; resetting...");
                return runAppletAsync(samd21.reset);
            })
                .then(function () { return s.close(); });
        });
    });
}
exports.flashSerialAsync = flashSerialAsync;
// source for samd21flash
/*
#define wait_ready() \
        while (NVMCTRL->INTFLAG.bit.READY == 0);

void flash_write(void) {
    uint32_t *src = (void *)0x20006000;
    uint32_t *dst = (void *)*src++;
    uint32_t n_rows = *src++;

    NVMCTRL->CTRLB.bit.MANW = 1;
    while (n_rows--) {
        wait_ready();
        NVMCTRL->STATUS.reg = NVMCTRL_STATUS_MASK;

        // Execute "ER" Erase Row
        NVMCTRL->ADDR.reg = (uint32_t)dst / 2;
        NVMCTRL->CTRLA.reg = NVMCTRL_CTRLA_CMDEX_KEY | NVMCTRL_CTRLA_CMD_ER;
        wait_ready();

        // there are 4 pages to a row
        for (int i = 0; i < 4; ++i) {
            // Execute "PBC" Page Buffer Clear
            NVMCTRL->CTRLA.reg = NVMCTRL_CTRLA_CMDEX_KEY | NVMCTRL_CTRLA_CMD_PBC;
            wait_ready();

            uint32_t len = FLASH_PAGE_SIZE >> 2;
            while (len--)
                *dst++ = *src++;

            // Execute "WP" Write Page
            NVMCTRL->CTRLA.reg = NVMCTRL_CTRLA_CMDEX_KEY | NVMCTRL_CTRLA_CMD_WP;
            wait_ready();
        }
    }
}
*/
