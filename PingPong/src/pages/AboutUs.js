import React from "react";
import Footer from "../components/Layout/Footer";
import NavBar from "../components/Layout/Navbar";
import { Helmet } from "react-helmet";
import Titulli from "../components/Layout/Titulli";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import styles from "./Style/AboutUs.module.css";
import "./Style/SwiperSlider.css";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";

function AboutUs() {
  const sliderImages = [
    {
      id: 1,
      src: `${process.env.PUBLIC_URL}/img/web/slider1.jpg`,
      alt: "Ping Pong 1",
    },
    {
      id: 2,
      src: `${process.env.PUBLIC_URL}/img/web/slider2.jpg`,
      alt: "Ping Pong 2",
    },
    {
      id: 3,
      src: `${process.env.PUBLIC_URL}/img/web/slider3.jpg`,
      alt: "Ping Pong 3",
    },
  ];

  return (
    <>
      <NavBar />
      <Helmet>
        <title>About Us | Sport Store</title>
      </Helmet>
      <Titulli titulli={"About Us"} />
      <section id="about-us" className={`${styles.aboutPage} py-5`}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutTxt}>
            <h2 className={`${styles.title} text-center mb-5`}>
              About Ping Pong
            </h2>
            <div className={styles.txt}>
              <p>
                Welcome to the world of <strong>Ping Pong</strong>, a sport that
                combines skill, strategy, and fun!
              </p>
              <p>
                Ping Pong, also known as table tennis, is a beloved sport
                enjoyed by millions around the world. From casual play in
                basements and garages to competitive matches in professional
                arenas, ping pong has a rich history and a global following.
              </p>
            </div>

            <h3 className={`${styles.mt5}`}>History of Ping Pong</h3>

            <p className={styles.txt}>
              Ping Pong originated in England during the late 19th century as a
              parlor game for the upper class. Originally played with books as
              paddles and a golf ball, the game quickly evolved with the
              introduction of specialized equipment. The name "ping pong" comes
              from the sound made when the ball strikes the paddle and table.
            </p>
            <p className={styles.txt}>
              In 1901, John Jaques & Son Ltd, an English sports equipment
              manufacturer, trademarked the term "Ping Pong." The game continued
              to grow in popularity, leading to the formation of the
              International Table Tennis Federation (ITTF) in 1926. The first
              official World Championships were held in London in 1926.
            </p>
          </div>
          <div className={styles.sliderContainer}>
            <h2 className={`${styles.title} mb-5 text-center`}>
              Ping Pong Highlights
            </h2>
            <Swiper
              spaceBetween={30}
              centeredSlides={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Autoplay, Pagination, Navigation]}
              className="mySwiper">
              {sliderImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <img src={image.src} alt={image.alt} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <section id="video-player">
        <VideoPlayer />
      </section>
      <section className={`${styles.aboutPage} py-5`}>
        <div className={styles.rulesSection}>
          <h2 className={`${styles.title} mb-5 text-center`}>
            Rules of Ping Pong
          </h2>
          <p>
            1. The game begins with a serve, where one player hits the ball over
            the net to the opponent's side of the table.
          </p>
          <p>
            2. The opponent then hits the ball back, and play continues until
            one player fails to return the ball within the rules.
          </p>
          <p>
            3. Points are scored when the opponent fails to return the ball, or
            if they hit the ball out of bounds.
          </p>
          <p>
            4. The first player to reach 11 points wins the game, but the game
            must be won by at least a 2-point margin.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default AboutUs;
