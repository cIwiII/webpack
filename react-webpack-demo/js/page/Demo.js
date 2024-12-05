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
import dem from '../../scss/demo.module.scss';
function Demo() {
    console.log(new Date().getTime(), 123);
    var de = function () {
    };
    return (_jsxs("div", { children: [_jsx("div", __assign({ className: "".concat(dem.bb, " ").concat(dem.aa) }, { children: "\u591A\u4E2Aclass\u6A21\u5757\u5C5E\u6027" })), _jsx("ul", __assign({ onClick: de }, { children: _jsx("li", {}) }))] }));
}
export default Demo;
