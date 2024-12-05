import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';

// import png from ''
// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

// import '../../node_modules/swiper/swiper';
import "swiper/modules/pagination/pagination";

export default () => {
    return (
        <>

            <Swiper
                // install Swiper modulesn
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: true }}
                onSwiper={(swiper) => console.log(swiper)}
                onSlideChange={() => console.log('slide change')}
            >
                <SwiperSlide><img src="../../public/logo192.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="../../public/logo192.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="../../public/logo192.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="../../public/logo192.png" alt="" /></SwiperSlide>
                ...
            </Swiper>
            <Swiper
            >
                <SwiperSlide>Slide 1</SwiperSlide>

                ...
            </Swiper>
        </>
    );
};