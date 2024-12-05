// 用户体验收集
import { ReportHandler } from 'web-vitals';

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);//累计布局偏移,布局跳动
      getFID(onPerfEntry);//首次输入延迟
      getFCP(onPerfEntry);//首次内容绘制，第一个dom
      getLCP(onPerfEntry);//最大内容渲染时间
      getTTFB(onPerfEntry); //首字节到达的时间点
    });
  }
};

export default reportWebVitals;


/* 
FCP值表示，当前页面中元素最早出现时间是在页面开始加载后的112ms。
LCP值表示元素最晚出现的时间是加载开始后135.8ms。
CLS值表示我的页面中元素的没有偏移，在缩放变换后该值还是0，
那么说明这个页面还是比较稳定流畅的
*/