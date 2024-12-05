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
// import swiper from '../scss/Swiper.module.scss'
import '../../scss/swip.scss';
function Swipers() {
    var _a = useState(true), active = _a[0], setActive = _a[1];
    return (_jsxs("div", __assign({ className: "swiper" }, { children: [_jsx("input", { type: "radio", name: "slider", className: "slide-radio1", id: "slider_1", checked: active }), _jsx("input", { type: "radio", name: "slider", className: "slide-radio2", id: "slider_2" }), _jsx("input", { type: "radio", name: "slider", className: "slide-radio3", id: "slider_3" }), _jsx("input", { type: "radio", name: "slider", className: "slide-radio4", id: "slider_4" }), _jsxs("div", __assign({ className: "slider-pagination" }, { children: [_jsx("label", { htmlFor: "slider_1", className: "page1", onClick: function () { return setActive(true); } }), _jsx("label", { htmlFor: "slider_2", className: "page2", onClick: function () { return setActive(false); } }), _jsx("label", { htmlFor: "slider_3", className: "page3", onClick: function () { return setActive(false); } }), _jsx("label", { htmlFor: "slider_4", className: "page4", onClick: function () { return setActive(false); } })] })), _jsx("div", __assign({ className: "slider slide1" }, { children: _jsxs("div", { children: [_jsx("h2", { children: "Css Based slider" }), _jsx("a", __assign({ href: "#", className: "button" }, { children: "Download" }))] }) })), _jsx("div", __assign({ className: "slider slide2" }, { children: _jsxs("div", { children: [_jsx("h2", { children: "CSS Slider without use of any javascript or jQuery" }), _jsx("a", __assign({ href: "#", className: "button" }, { children: "Download" }))] }) })), _jsx("div", __assign({ className: "slider slide3" }, { children: _jsxs("div", { children: [_jsx("h2", { children: "Full screen animation slider" }), _jsx("a", __assign({ href: "#", className: "button" }, { children: "Download" }))] }) })), _jsx("div", __assign({ className: "slider slide4" }, { children: _jsxs("div", { children: [_jsx("h2", { children: "css3 slider" }), _jsx("a", __assign({ href: "#", className: "button" }, { children: "Download" }))] }) }))] })));
}
export default Swipers;
