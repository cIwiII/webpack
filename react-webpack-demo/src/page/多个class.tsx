import React from 'react'
import classnames from 'classnames'
import dem from '../../scss/demo.module.scss'
function Demo() {
  console.log(new Date().getTime(), 123)
  const de = () => {
  }

  return (
    <div className={dem.ss}>
      <div className={`${dem.bb} ${dem.aa}`}>多个class模块属性</div>
      <div className={[dem.fruit, dem.apple, dem.fa].join(' ')}>方式二</div>
      <div className={classnames({
          [dem['class1']]: true,
          [dem['class2']]: true,
          [dem.class3]: true,
        })}
      >
        第三种,麻烦,下插件(margin-left:50px)
      </div>
      <ul onClick={de}>
        <li></li>
      </ul>
    </div >
  )
}

export default Demo