var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import classnames from 'classnames';
import dem from '../../scss/demo.module.scss';
function Demo() {
    var _a;
    console.log(new Date().getTime(), 123);
    var de = function () {
    };
    return (_jsxs("div", __assign({ className: dem.ss }, { children: [_jsx("div", __assign({ className: "".concat(dem.bb, " ").concat(dem.aa) }, { children: "\u591A\u4E2Aclass\u6A21\u5757\u5C5E\u6027" })), _jsx("div", __assign({ className: [dem.fruit, dem.apple, dem.fa].join(' ') }, { children: "\u65B9\u5F0F\u4E8C" })), _jsx("div", __assign({ className: classnames((_a = {},
                    _a[dem['class1']] = true,
                    _a[dem['class2']] = true,
                    _a[dem.class3] = true,
                    _a)) }, { children: "\u7B2C\u4E09\u79CD,\u9EBB\u70E6,\u4E0B\u63D2\u4EF6(margin-left:50px)" })), _jsx("ul", __assign({ onClick: de }, { children: _jsx("li", {}) }))] })));
}
export default Demo;
