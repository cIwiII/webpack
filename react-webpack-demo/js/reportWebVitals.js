var reportWebVitals = function (onPerfEntry) {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(function (_a) {
            var getCLS = _a.getCLS, getFID = _a.getFID, getFCP = _a.getFCP, getLCP = _a.getLCP, getTTFB = _a.getTTFB;
            getCLS(onPerfEntry); //累计布局偏移,布局跳动
            getFID(onPerfEntry); //首次输入延迟
            getFCP(onPerfEntry); //首次内容绘制，第一个dom
            getLCP(onPerfEntry); //最大内容渲染时间
            getTTFB(onPerfEntry); //首字节到达的时间点
        });
    }
};
export default reportWebVitals;
