import React, { useState } from 'react'

function srcoll() {
    const [isFixed, setIsFixed] = useState(false)
    // 方式一
    window.addEventListener("scroll", () => {
        console.log('滚动高度',window.scrollY)
        window.scrollY >= 200 ? setIsFixed(true) : setIsFixed(false)
    })
    // 方式二
    window.onscroll = () => {
        console.log('滚动')
    }

    return (
        <div className="App" style={{ height: 3000 }}>
            <div style={{ width: 200, height: 30, backgroundColor: "red", position: isFixed ? "fixed" : "relative" }} className='ban'>
                滚动输出
            </div>
            <div>
                滚动获取高度
                <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

            </div>
        </div>
    )

}

export default srcoll