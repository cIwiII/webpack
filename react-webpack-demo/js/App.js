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
import Try from './page/Try';
function App() {
    console.log('123435654321');
    return (_jsxs("div", __assign({ className: "App" }, { children: [_jsx("p", { children: "App\u9875\u9762\uFF0C\u4E00\u4E0B\u4E3A\u7EC4\u4EF6\u9875" }), _jsx(Try, {})] })));
}
export default App;
