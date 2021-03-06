"use strict";
/* tslint:disable:forin cli only run in node */
Object.defineProperty(exports, "__esModule", { value: true });
var MaxColumns = 100;
var argRegex = /^(-+)?(.+)$/;
var CommandParser = /** @class */ (function () {
    function CommandParser() {
        this.commands = [];
    }
    CommandParser.prototype.defineCommand = function (c, callback) {
        var aliasMap = {};
        var _loop_1 = function (flag) {
            var def = c.flags[flag];
            recordAlias(flag, flag);
            var aliases = c.flags[flag].aliases;
            if (aliases) {
                aliases.forEach(function (alias) {
                    recordAlias(flag, alias);
                });
            }
        };
        for (var flag in c.flags) {
            _loop_1(flag);
        }
        c._aliasMap = aliasMap;
        c._callback = callback;
        this.commands.push(c);
        function recordAlias(flag, alias) {
            if (aliasMap[alias]) {
                throw new Error("Alias " + alias + " for flag " + flag + " duplicates the alias for flag " + aliasMap[alias]);
            }
            aliasMap[alias] = flag;
        }
    };
    CommandParser.prototype.parseCommand = function (args) {
        if (!args[0])
            args = ["help"];
        var name = args[0];
        var parsedArgs = [];
        var flags = {};
        var filtered = this.commands.filter(function (c) { return c.name === name || c.aliases && c.aliases.indexOf(name) !== -1; });
        if (!filtered.length)
            pxt.U.userError("Command '" + name + "' not found, use \"pxt help all\" to see available commands.");
        var command = filtered[0];
        if (command.anyArgs)
            return command._callback({
                name: command.name,
                args: args.slice(1),
                flags: flags
            });
        var currentFlag;
        var currentFlagDef;
        for (var i = 1; i < args.length; i++) {
            var match = argRegex.exec(args[i]);
            if (!match) {
                continue;
            }
            if (match[1]) {
                if (currentFlag)
                    pxt.U.userError("Expected value to follow flag '" + currentFlag + "'");
                var flagName = command._aliasMap[match[2]];
                var debugFlag = flagName || match[2];
                if (debugFlag == "debug" || debugFlag == "d" || debugFlag == "dbg") {
                    pxt.options.debug = true;
                    pxt.debug = console.log;
                    pxt.log("debug mode");
                    if (!flagName)
                        continue;
                }
                if (!flagName)
                    pxt.U.userError("Unrecognized flag '" + match[2] + "' for command '" + command.name + "'");
                var flagDefinition = command.flags[flagName];
                if (flagDefinition.argument) {
                    currentFlag = flagName;
                    currentFlagDef = flagDefinition;
                }
                else {
                    flags[flagName] = true;
                }
            }
            else if (currentFlag) {
                if (currentFlagDef.possibleValues && currentFlagDef.possibleValues.length && currentFlagDef.possibleValues.indexOf(match[2]) === -1) {
                    pxt.U.userError("Unknown value for flag '" + currentFlag + "', '" + match[2] + "'");
                }
                if (!currentFlagDef.type || currentFlagDef.type === "string") {
                    flags[currentFlag] = match[2];
                }
                else if (currentFlagDef.type === "boolean") {
                    flags[currentFlag] = match[2].toLowerCase() === "true";
                }
                else {
                    try {
                        flags[currentFlag] = parseFloat(match[2]);
                    }
                    catch (e) {
                        throw new Error("Flag '" + currentFlag + "' expected an argument of type number but received '" + match[2] + "'");
                    }
                }
                currentFlag = undefined;
                currentFlagDef = undefined;
            }
            else {
                parsedArgs.push(match[2]);
            }
        }
        if (currentFlag) {
            pxt.U.userError("Expected value to follow flag '" + currentFlag + "'");
        }
        else if (!command.argString && parsedArgs.length) {
            pxt.U.userError("Command '" + command.name + "' expected exactly 0 argument(s) but received " + parsedArgs.length);
        }
        else if (command.numArgs && parsedArgs.length !== command.numArgs) {
            pxt.U.userError("Command '" + command.name + "' expected exactly " + command.numArgs + " argument(s) but received " + parsedArgs.length);
        }
        return command._callback({
            name: command.name,
            args: parsedArgs,
            flags: flags
        });
    };
    CommandParser.prototype.printHelp = function (args, print) {
        if (args && args.length === 1) {
            var name_1 = args[0];
            if (name_1 === "all") {
                this.printTopLevelHelp(true, print);
            }
            else {
                var filtered = this.commands.filter(function (c) { return c.name === name_1 || c.aliases && c.aliases.indexOf(name_1) !== -1; });
                if (filtered) {
                    this.printCommandHelp(filtered[0], print);
                }
            }
        }
        else {
            this.printTopLevelHelp(false, print);
        }
    };
    CommandParser.prototype.printCommandHelp = function (c, print) {
        var usage = "    pxt " + c.name;
        if (c.argString) {
            usage += " " + c.argString;
        }
        if (c.flags) {
            for (var flag in c.flags) {
                var def = c.flags[flag];
                if (def.possibleValues && def.possibleValues.length) {
                    usage += " [" + dash(flag) + " " + def.possibleValues.join("|") + "]";
                }
                else if (def.argument) {
                    usage += " [" + dash(flag) + " " + def.argument + "]";
                }
                else {
                    usage += " [" + dash(flag) + "]";
                }
            }
        }
        print("");
        print("Usage:");
        print(usage);
        print("");
        print(c.help);
        if (c.aliases && c.aliases.length) {
            print("");
            print("Aliases:");
            c.aliases.forEach(function (a) { return print("    " + a); });
        }
        var flagNames = [];
        var flagDescriptions = [];
        var maxWidth = 0;
        for (var flag in c.flags) {
            var def = c.flags[flag];
            if (def.deprecated)
                continue;
            var usage_1 = dash(flag);
            if (def.aliases && def.aliases.length) {
                usage_1 += " " + def.aliases.map(dash).join(" ");
            }
            if (def.argument) {
                if (def.possibleValues && def.possibleValues.length) {
                    usage_1 += " <" + def.possibleValues.join("|") + ">";
                }
                else {
                    usage_1 += def.type && def.type === "number" ? " <number>" : " <value>";
                }
            }
            maxWidth = Math.max(maxWidth, usage_1.length);
            flagNames.push(usage_1);
            flagDescriptions.push(def.description);
        }
        if (flagNames.length) {
            print("");
            print("Flags:");
            for (var i = 0; i < flagNames.length; i++) {
                printLine(flagNames[i], maxWidth, flagDescriptions[i], print);
            }
        }
        if (c.onlineHelp)
            print("More information at " + ("https://makecode.com/cli/" + c.name) + " .");
    };
    CommandParser.prototype.printTopLevelHelp = function (advanced, print) {
        print("");
        print("Usage: pxt <command>");
        print("");
        print("Commands:");
        this.commands.sort(function (a, b) { return a.priority - b.priority; });
        var toPrint = advanced ? this.commands : this.commands.filter(function (c) { return !c.advanced; });
        var cmdDescriptions = [];
        var maxNameWidth = 0;
        var names = toPrint.map(function (command) {
            maxNameWidth = Math.max(maxNameWidth, command.name.length);
            cmdDescriptions.push(command.help);
            return command.name;
        });
        for (var i = 0; i < names.length; i++) {
            printLine(names[i], maxNameWidth, cmdDescriptions[i], print);
        }
        print("");
        print("For more information on a command, try 'pxt help <command>'");
    };
    return CommandParser;
}());
exports.CommandParser = CommandParser;
function printLine(name, maxNameWidth, description, print) {
    // Lines are of the format: name ...... description
    var line = pad("    " + name + " ", maxNameWidth - name.length + 3, false, ".");
    var prefixLength = line.length;
    // Split the description into words so that we can try and do some naive wrapping
    var dWords = description.split(" ");
    dWords.forEach(function (w) {
        if (line.length + w.length < MaxColumns) {
            line += " " + w;
        }
        else {
            print(line);
            line = pad(w, prefixLength + 1, true);
        }
    });
    print(line);
}
function pad(str, len, left, char) {
    if (char === void 0) { char = " "; }
    for (var i = 0; i < len; i++) {
        if (left) {
            str = char + str;
        }
        else {
            str += char;
        }
    }
    return str;
}
function dash(flag) {
    if (flag.length === 1) {
        return "-" + flag;
    }
    return "--" + flag;
}
