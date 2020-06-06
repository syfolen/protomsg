"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ItemDfn_1 = require("../dfn/ItemDfn");
var BaseParser_1 = require("./BaseParser");
var StringUtil_1 = require("../utils/StringUtil");
var DfnFlagEnum_1 = require("../constants/DfnFlagEnum");
var M_1 = require("../utils/M");
var FileUtil_1 = require("../utils/FileUtil");
var ParseFile = /** @class */ (function (_super) {
    __extends(ParseFile, _super);
    function ParseFile(path) {
        var _this = _super.call(this, path) || this;
        _this.$dfnList = [];
        while (_this.$lines.length > 0) {
            var dfn = _this.$readNextDfn();
            if (dfn === null) {
                continue;
            }
            _this.$dfnList.push(dfn);
        }
        _this.$dfnList.sort(function (a, b) {
            return a.name.charCodeAt(0) - b.name.charCodeAt(0);
        });
        _this.$mergeEnums();
        _this.$mergeMessages();
        return _this;
    }
    ParseFile.prototype.$mergeEnums = function () {
        var dfns = [];
        for (var _i = 0, _a = this.$dfnList; _i < _a.length; _i++) {
            var dfn = _a[_i];
            if (dfn.kind === "enum") {
                dfns.push(dfn);
            }
        }
        for (var i = 0; i < dfns.length; i++) {
            var dfn = dfns[i];
            if (i > 0) {
                M_1.M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "/**");
                for (var _b = 0, _c = dfn.comments; _b < _c.length; _b++) {
                    var comment = _c[_b];
                    M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " * " + comment);
                }
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " */");
            }
            else {
                M_1.M.lines.push("");
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "export enum " + dfn.name + " {");
            for (var i_1 = 0; i_1 < dfn.dfns.length; i_1++) {
                var item = dfn.dfns[i_1];
                if (i_1 > 0) {
                    M_1.M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "/**");
                    for (var _d = 0, _e = item.comments; _d < _e.length; _d++) {
                        var comment = _e[_d];
                        M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " * " + comment);
                    }
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " */");
                }
                else {
                    M_1.M.lines.push("");
                }
                var comma = i_1 === dfn.dfns.length - 1 ? "" : ",";
                M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + item.name + comma);
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "}");
        }
        for (var i = 0; i < dfns.length; i++) {
            var dfn = dfns[i];
            if (i > 0) {
                M_1.M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "/**");
                for (var _f = 0, _g = dfn.comments; _f < _g.length; _f++) {
                    var comment = _g[_f];
                    M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " * " + comment);
                }
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " */");
            }
            else {
                M_1.M.lines.push("");
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "export interface I" + dfn.name + " {");
            for (var i_2 = 0; i_2 < dfn.dfns.length; i_2++) {
                var item = dfn.dfns[i_2];
                if (i_2 > 0) {
                    M_1.M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "/**");
                    for (var _h = 0, _j = item.comments; _h < _j.length; _h++) {
                        var comment = _j[_h];
                        M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " * " + comment);
                    }
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " */");
                }
                else {
                    M_1.M.lines.push("");
                }
                M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + item.name + ": number;");
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "}");
        }
    };
    ParseFile.prototype.$mergeMessages = function () {
        var dfns = [];
        for (var _i = 0, _a = this.$dfnList; _i < _a.length; _i++) {
            var dfn = _a[_i];
            if (dfn.kind === "message") {
                dfns.push(dfn);
            }
        }
        for (var i = 0; i < dfns.length; i++) {
            var dfn = dfns[i];
            if (i > 0) {
                M_1.M.lines.push("");
            }
            if (dfn.comments.length > 0) {
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "/**");
                for (var _b = 0, _c = dfn.comments; _b < _c.length; _b++) {
                    var comment = _c[_b];
                    M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " * " + comment);
                }
                M_1.M.lines.push(FileUtil_1.FileUtil.TAB + " */");
            }
            else {
                M_1.M.lines.push("");
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "export interface I" + dfn.name + " {");
            for (var i_3 = 0; i_3 < dfn.dfns.length; i_3++) {
                var item = dfn.dfns[i_3];
                if (i_3 > 0) {
                    M_1.M.lines.push("");
                }
                if (item.comments.length > 0) {
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + "/**");
                    for (var _d = 0, _e = item.comments; _d < _e.length; _d++) {
                        var comment = _e[_d];
                        M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " * " + comment);
                    }
                    M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + " */");
                }
                else {
                    M_1.M.lines.push("");
                }
                var suffix = (item.flags & DfnFlagEnum_1.DfnFlagEnum.REPEATED) === 0 ? "" : "[]";
                M_1.M.lines.push("" + FileUtil_1.FileUtil.TAB + FileUtil_1.FileUtil.TAB + item.name + ": " + this.$converTypeToTSString(item.type) + suffix + ";");
            }
            M_1.M.lines.push(FileUtil_1.FileUtil.TAB + "}");
        }
    };
    ParseFile.prototype.$converTypeToTSString = function (type) {
        var array = ["string", "int32", "int64", "bool", "string", "number", "dcodeIO.Long", "boolean"];
        var index = array.indexOf(type);
        if (index === -1) {
            for (var _i = 0, _a = this.$dfnList; _i < _a.length; _i++) {
                var dfn = _a[_i];
                if (dfn.name === type) {
                    if (dfn.kind === "enum") {
                        return type;
                    }
                    else {
                        return "I" + type;
                    }
                }
            }
        }
        return array[index + 4];
    };
    ParseFile.prototype.$readNextDfn = function () {
        var dfn = new ItemDfn_1.ItemDfn();
        dfn.comments = this.$readComments();
        var line = this.$lines.shift();
        if (this.$isDfnEnum(line)) {
            dfn.kind = "enum";
        }
        else if (this.$isDfnMessage(line)) {
            dfn.kind = "message";
        }
        else {
            this.$throwError(line);
        }
        dfn.name = this.$readDfnName(line);
        while (true) {
            var lineDfn = null;
            if (dfn.kind === "enum") {
                lineDfn = this.$readEnumLineDfn();
            }
            else if (dfn.kind === "message") {
                lineDfn = this.$readMessageLineDfn();
            }
            if (lineDfn === null) {
                break;
            }
            dfn.dfns.push(lineDfn);
        }
        if (dfn.dfns.length === 0) {
            return null;
        }
        return dfn;
    };
    ParseFile.prototype.$readEnumLineDfn = function () {
        var dfn = new ItemDfn_1.ItemDfn();
        dfn.comments = this.$readComments();
        var line = this.$lines.shift();
        if (line === "}") {
            return null;
        }
        if (line.charAt(line.length - 1) === ";") {
            line = line.substr(0, line.length - 1);
        }
        var array = line.split(" ");
        dfn.name = StringUtil_1.StringUtil.trim(array[0]);
        dfn.value = StringUtil_1.StringUtil.trim(array[2]);
        return dfn;
    };
    ParseFile.prototype.$readMessageLineDfn = function () {
        var dfn = new ItemDfn_1.ItemDfn();
        dfn.comments = this.$readComments();
        var line = this.$lines.shift();
        if (line === "}") {
            return null;
        }
        if (line.charAt(line.length - 1) === ";") {
            line = line.substr(0, line.length - 1);
        }
        var array = line.split(" ");
        if (array.length === 5) {
            if (array[0] === "repeated") {
                dfn.flags |= DfnFlagEnum_1.DfnFlagEnum.REPEATED;
            }
            else {
                this.$throwError(line);
            }
            array.shift();
        }
        dfn.type = array[0];
        dfn.name = array[1];
        dfn.value = array[3];
        return dfn;
    };
    ParseFile.prototype.$readDfnName = function (line) {
        var reg0 = line.indexOf(" ") + 1;
        if (reg0 === 0) {
            this.$throwError(line);
        }
        var index = line.indexOf(" {");
        if (index === -1) {
            index = line.indexOf("{");
        }
        if (index === -1) {
            this.$throwError(line);
        }
        return line.substring(reg0, index);
    };
    return ParseFile;
}(BaseParser_1.BaseParser));
exports.ParseFile = ParseFile;
//# sourceMappingURL=FileParser.js.map