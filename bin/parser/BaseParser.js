"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StringUtil_1 = require("../utils/StringUtil");
var FileUtil_1 = require("../utils/FileUtil");
var BaseParser = /** @class */ (function () {
    function BaseParser(path) {
        this.$lines = [];
        var lines = FileUtil_1.FileUtil.readAllLines(path);
        for (var i = 0; i < lines.length; i++) {
            var line = StringUtil_1.StringUtil.trim(lines[i]);
            var index = line.indexOf("//");
            if (index === -1 || index === 0) {
                this.$lines.push(line);
            }
            else {
                this.$lines.push(line.substr(index));
                this.$lines.push(StringUtil_1.StringUtil.trim(line.substr(0, index)));
            }
        }
        this.$lines.shift();
        this.$lines.shift();
        for (var i = 0; i < this.$lines.length; i++) {
            var line = this.$lines[i];
            if (this.$isDfnComment(line) === false) {
                line = line.replace("=", " = ");
                line = StringUtil_1.StringUtil.replaceAll(line, "\t", " ");
                line = StringUtil_1.StringUtil.replaceAll(line, "  ", " ");
                this.$lines[i] = StringUtil_1.StringUtil.trim(line);
            }
        }
    }
    BaseParser.prototype.$readComments = function () {
        var comments = [];
        while (this.$lines.length > 0) {
            var line = this.$lines[0];
            if (this.$isNotSupport(line) === true) {
                throw Error("\u89E3\u6790\u5931\u8D25\uFF1A" + line);
            }
            if (this.$isDfnEnum(line) || this.$isDfnMessage(line)) {
                break;
            }
            if (this.$isDfnComment(line)) {
                line = StringUtil_1.StringUtil.trim(line.substr(2));
                comments.push(line);
            }
            else {
                break;
            }
            this.$lines.shift();
        }
        return comments;
    };
    BaseParser.prototype.$isDfnEnum = function (line) {
        return line.substr(0, 4) === "enum";
    };
    BaseParser.prototype.$isDfnMessage = function (line) {
        return line.substr(0, 7) === "message";
    };
    BaseParser.prototype.$isDfnComment = function (line) {
        return line.substr(0, 2) === "//";
    };
    BaseParser.prototype.$isNotSupport = function (line) {
        return line.substr(0, 2) === "/*";
    };
    BaseParser.prototype.$throwError = function (line) {
        throw Error("\u89E3\u6790\u5931\u8D25\uFF1A" + line);
    };
    return BaseParser;
}());
exports.BaseParser = BaseParser;
//# sourceMappingURL=BaseParser.js.map