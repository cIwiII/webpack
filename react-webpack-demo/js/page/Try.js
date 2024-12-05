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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// import png from ''
// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
// import '../../node_modules/swiper/swiper';
import "../../node_modules/swiper/modules/pagination/pagination";
export default (function () {
    return (_jsxs(_Fragment, { children: [_jsxs(Swiper
            // install Swiper modulesn
            , __assign({ 
                // install Swiper modulesn
                modules: [Navigation, Pagination, Scrollbar, A11y], spaceBetween: 50, slidesPerView: 3, navigation: true, pagination: { clickable: true }, scrollbar: { draggable: true }, onSwiper: function (swiper) { return console.log(swiper); }, onSlideChange: function () { return console.log('slide change'); } }, { children: [_jsx(SwiperSlide, { children: _jsx("img", { src: "../../public/logo192.png", alt: "" }) }), _jsx(SwiperSlide, { children: _jsx("img", { src: "../../public/logo192.png", alt: "" }) }), _jsx(SwiperSlide, { children: _jsx("img", { src: "../../public/logo192.png", alt: "" }) }), _jsx(SwiperSlide, { children: _jsx("img", { src: "../../public/logo192.png", alt: "" }) }), "..."] })), _jsxs(Swiper, { children: [_jsx(SwiperSlide, { children: "Slide 1" }), "..."] })] }));
});
