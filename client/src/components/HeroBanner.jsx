import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import SummaryApi from '../common/SummaryApi'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Axios from '../utils/Axios';
import banner from '../assets/banner.jpeg';
import bannerMobile from '../assets/banner-mobile.jpg';
import BestPricesOffers from '../assets/Best_Prices_Offers.png';
import WideAssortment from '../assets/Wide_Assortment.png';
import minuteDelivery from '../assets/minute_delivery.png';

const staticSlides = [
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
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await Axios({...SummaryApi.getBanner});
        // const res = await Axios.get('/api/banner/');
        console.log('Fetched banners:', res);
        setBanners(res.data.data || []);
      } catch (err) {
        console.error("There was an error fetching banners:", err);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Use backend banners if available, otherwise fallback to static
  const slides = banners.length > 0
    ? banners.map(b => ({
        img: b.image,
        alt: b.caption || 'Banner',
        caption: b.caption,
        link: b.link,
      }))
    : staticSlides;

  return (
    <div className="w-full relative mt-1 sm:mt-6 md:mt-8 lg:mt-10">
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active'
        }}
        autoplay={{ 
          delay: 3000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        }}
        loop={true}
        speed={600}
        className="hero-swiper"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="w-full relative overflow-hidden rounded-lg shadow-lg aspect-[21/9] bg-gray-200">
              {/* Desktop & Mobile Image (always fills aspect-ratio box) */}
              <img
                src={slide.mobile && window.innerWidth < 768 ? slide.mobile : slide.img}
                alt={slide.alt}
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                draggable="false"
                loading="lazy"
                style={{ userSelect: 'none' }}
              />
              {/* Caption Overlay */}
              {slide.caption && (
                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 flex justify-center px-4">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl font-bold shadow-lg backdrop-blur-sm">
                    {slide.link ? (
                      <a href={slide.link} target="_blank" rel="noopener noreferrer" className="underline">{slide.caption}</a>
                    ) : (
                      slide.caption
                    )}
                  </span>
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !text-white !bg-black !bg-opacity-50 !w-10 !h-10 !rounded-full !flex !items-center !justify-center hover:!bg-opacity-70 transition-all duration-200 !left-2 sm:!left-4 md:!left-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="swiper-button-next !text-white !bg-black !bg-opacity-50 !w-10 !h-10 !rounded-full !flex !items-center !justify-center hover:!bg-opacity-70 transition-all duration-200 !right-2 sm:!right-4 md:!right-6">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        {/* Custom Pagination */}
        <div className="swiper-pagination !bottom-2 sm:!bottom-4 md:!bottom-6"></div>
      </Swiper>
      {/* Custom CSS for better responsive design */}
      <style>{`
        .hero-swiper {
          border-radius: 0.5rem;
          overflow: hidden;
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          width: 8px !important;
          height: 8px !important;
          margin: 0 4px !important;
        }
        .swiper-pagination-bullet-active {
          background: #10b981 !important;
          transform: scale(1.2) !important;
        }
        .swiper-button-prev,
        .swiper-button-next {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .hero-swiper:hover .swiper-button-prev,
        .hero-swiper:hover .swiper-button-next {
          opacity: 1;
        }
        @media (max-width: 640px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }
        @media (min-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 40px !important;
            height: 40px !important;
          }
        }
        @media (min-width: 1024px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 50px !important;
            height: 50px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroBanner; 