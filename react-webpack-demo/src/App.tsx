import React from 'react';
import Demo from './page/多个class';
import Srcoll from './page/滚动监听';
import Swipers from './page/全屏滚动Swiper';
import Fixeds from './page/css固定'
import Swiper from './page/css原生轮播';
import Try from './page/Try';
function App() {
  console.log('123435654321')
  return (
    <div className="App">
      <p>App页面，一下为组件页</p>
      {/* <Demo></Demo>  */}
      {/* <Srcoll></Srcoll> */}
      {/* <Swipers></Swipers> */}
      {/* <Fixeds></Fixeds> */}
      {/* <Swiper></Swiper> */}
      <Try></Try>
    </div>
  );
}

export default App;
