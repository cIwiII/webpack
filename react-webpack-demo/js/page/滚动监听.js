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
import { useState } from 'react';
function srcoll() {
    var _a = useState(false), isFixed = _a[0], setIsFixed = _a[1];
    // 方式一
    window.addEventListener("scroll", function () {
        console.log('滚动高度', window.scrollY);
        window.scrollY >= 200 ? setIsFixed(true) : setIsFixed(false);
    });
    // 方式二
    window.onscroll = function () {
        console.log('滚动');
    };
    return (_jsxs("div", __assign({ className: "App", style: { height: 3000 } }, { children: [_jsx("div", __assign({ style: { width: 200, height: 30, backgroundColor: "red", position: isFixed ? "fixed" : "relative" }, className: 'ban' }, { children: "\u6EDA\u52A8\u8F93\u51FA" })), _jsxs("div", { children: ["\u6EDA\u52A8\u83B7\u53D6\u9AD8\u5EA6", _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {}), _jsx("br", {})] })] })));
}
export default srcoll;
