import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import banner from '../assets/banner.jpeg';
import bannerMobile from '../assets/banner-mobile.jpg';
import BestPricesOffers from '../assets/Best_Prices_Offers.png';
import WideAssortment from '../assets/Wide_Assortment.png';
import minuteDelivery from '../assets/minute_delivery.png';

const slides = [
  {
    img: banner,
    alt: 'Big Sale Banner',
    mobile: bannerMobile,
    // caption: 'Big Billion Days - Unbeatable Offers!',
  },
  {
    img: BestPricesOffers,
    alt: 'Best Prices Offers',
    // caption: 'Best Prices & Offers on All Products',
  },
  {
    img: WideAssortment,
    alt: 'Wide Assortment',
    // caption: 'Wide Assortment for Every Need',
  },
  {
    img: minuteDelivery,
    alt: 'Minute Delivery',
    // caption: 'Lightning Fast Delivery!',
  },
];

const HeroBanner = () => {
  return (
    <div className="w-full relative mt-8 md:mt-2">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        loop
        className="h-32 md:h-48 lg:h-60 rounded-lg"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <img
                src={slide.img}
                alt={slide.alt}
                className="w-full h-32 md:h-48 lg:h-60 object-cover hidden md:block rounded-lg"
                draggable="false"
              />
              {slide.mobile ? (
                <img
                  src={slide.mobile}
                  alt={slide.alt}
                  className="w-full h-32 md:h-48 lg:h-60 object-cover md:hidden rounded-lg"
                  draggable="false"
                />
              ) : null}
              {slide.caption && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                  <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded text-lg md:text-2xl font-bold shadow">
                    {slide.caption}
                  </span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroBanner; 