import React, { useEffect, useRef } from "react";
import "../App.css";
import homepage_background from "../assets/homepage-background.mp4";
import search_pic from "../assets/search-pic.svg";
import { Autoplay, EffectFade, Pagination, Navigation,EffectCube } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import left_arrow from "../assets/left-arrow.svg";
import double_down_arrow from "../assets/double-down-arrow.svg";
import plane from "../assets/plane.svg";
import picture from "../assets/picture.svg";
import ReactDOM from "react-dom";
import CardFlip from "./CardFlip";

const LandingPages = () => {
  const sectionsRef1 = useRef([]);
  const sectionsRef2 = useRef([]);
  const chatRoomRef = useRef(null);

  useEffect(() => {
    const options = {
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("homepage-hidden");
        } else {
          entry.target.classList.add("homepage-hidden");
        }
      });
    }, options);

    const validSections1 = sectionsRef1.current.filter((section) => section);
    validSections1.forEach((section) => {
      if (section instanceof Element) {
        observer.observe(section);
      }
    });

    const validSections2 = sectionsRef2.current.filter((section) => section);
    validSections2.forEach((section) => {
      if (section instanceof Element) {
        observer.observe(section);
      }
    });

    return () => {
      validSections1.forEach((section) => {
        if (section instanceof Element) {
          observer.unobserve(section);
        }
      });

      validSections2.forEach((section) => {
        if (section instanceof Element) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  useEffect(() => {
    const scrollContainer = chatRoomRef.current;
    let scrollDown = true;

    const scroll = () => {
      if (scrollContainer.scrollTop === 0) {
        scrollDown = true;
      } else if (
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
        scrollContainer.scrollHeight
      ) {
        scrollDown = false;
      }

      if (scrollDown) {
        scrollContainer.scrollBy(0, 1);
      } else {
        scrollContainer.scrollBy(0, -1);
      }
    };

    const intervalId = setInterval(scroll, 8);

    return () => clearInterval(intervalId);
  }, []);

  const section1 = (
    <div className="homepage-section1-box">
      <div className="homepage-section1-text">
        <div className="homepage-section1-titletext">
          Attract more opportunities
        </div>
        <div className="homepage-section1-subtext">
          Welcome to our website! Here, you can find courses you like and learn
          more about them.
        </div>
        <div className="homepage-section1-titletext2">100%</div>
        <div style={{ fontSize: "1em", paddingTop: "0px" }}>
          Contains 100% of UNSW courses.
        </div>
      </div>
      <div className="homepage-section1-pic">
        <div className="homepage-section1-pic-searchbox">
          <img src={search_pic} alt="" style={{ marginRight: "15px" }} />
          <p>Project</p>
        </div>
        <Swiper
          spaceBetween={30}
          centeredSlides={true}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectFade, Autoplay, Navigation, Pagination]}
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          loop
        >
          <SwiperSlide>
            <div className="homepage-section1-pic-floating-card">
              <div className="homepage-section1-pic-floating-card-title">
                Information Technology Project
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                COMP9900
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                School of Computer Science and Engineering
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                Detail:{" "}
              </div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "10px",
                  width: "150px",
                }}
              ></div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "5px",
                  width: "200px",
                }}
              ></div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="homepage-section1-pic-floating-card">
              <div className="homepage-section1-pic-floating-card-title">
                Research Project A
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                COMP9991
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                School of Computer Science and Engineering
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                Detail:{" "}
              </div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "10px",
                  width: "150px",
                }}
              ></div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "5px",
                  width: "200px",
                }}
              ></div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="homepage-section1-pic-floating-card">
              <div className="homepage-section1-pic-floating-card-title">
                Master Project A
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                CVEN9451
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                School of Civil and Environmental Engineering
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                Detail:{" "}
              </div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "10px",
                  width: "150px",
                }}
              ></div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "5px",
                  width: "200px",
                }}
              ></div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="homepage-section1-pic-floating-card">
              <div className="homepage-section1-pic-floating-card-title">
                Professional Experience Project
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                ADAD3000
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                School of Art & Design
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                Detail:{" "}
              </div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "10px",
                  width: "150px",
                }}
              ></div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "5px",
                  width: "200px",
                }}
              ></div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="homepage-section1-pic-floating-card">
              <div className="homepage-section1-pic-floating-card-title">
                Graduation Project Theory
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                CODE3201
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                School of Built Environment
              </div>
              <div className="homepage-section1-pic-floating-card-details">
                Detail:{" "}
              </div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "10px",
                  width: "150px",
                }}
              ></div>
              <div
                className="homepage-section1-pic-floating-card-detail"
                style={{
                  marginLeft: "60px",
                  marginBottom: "5px",
                  width: "200px",
                }}
              ></div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );

  const section2 = (
    <div className="homepage-section2-box">
      <div className="homepage-section2-pic">
        <div className="homepage-section2-chatroom">
          <div className="ChatRoom-detail-header">
            <div className="ChatRoom-detail-text">
              <div className="homepage-ChatRoom-detail-title"></div>
              <div
                className="homepage-ChatRoom-detail-title"
                style={{
                  width: "170px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              ></div>
            </div>
          </div>
          <div
            className="homepage-section2-ChatRoom-Messages"
            ref={chatRoomRef}
          >
            <p className="homepage-section2-receive">
              The recent courses are tough but challenging.
            </p>
            <p className="homepage-section2-send">
              I agree, especially the computer vision course. Each assignment
              teaches me a lot.
            </p>
            <p className="homepage-section2-receive">
              Yeah, the last project used deep learning techniques. I feel I'm
              progressing.
            </p>
            <p className="homepage-section2-send">
              I've been using Pineapple, a course selection and team formation
              site. It has great resources and lets you study with others.
            </p>
            <p className="homepage-section2-receive">
              Pineapple? How does it work?
            </p>
            <p className="homepage-section2-send">
              Just register, browse courses, and form teams with other students.
            </p>
            <p className="homepage-section2-receive">
              Sounds great! You can find courses and study with peers.
            </p>
            <p className="homepage-section2-send">
              Exactly. I found courses on convolutional neural networks and
              formed a study group.
            </p>
          </div>
          <div
            className="ChatRoom-text-field"
            style={{ backgroundColor: "#d2e4f6" }}
          >
            <div className="ChatRoom-text-field-container">
              <img src={picture} alt="Upload" />
              <div className="image-preview-container"></div>
              <div className="homepage-section2-textfield-text">
                Start a new message
              </div>
              <img src={plane} alt="Send" className="icon" />
            </div>
          </div>
        </div>
      </div>
      <div className="homepage-section2-text">
        <div className="homepage-section1-titletext">
          Stay Connected with Friends
        </div>
        <div className="homepage-section1-subtext">
          Here, you can find classmates and like-minded team members. Join us
          and start chatting immediately!
        </div>
        <div className="homepage-section1-titletext2">300%</div>
        <div style={{ fontSize: "1em", paddingTop: "0px" }}>
          Not only students, but also UNSW lecturers and tutors have already
          joined our website.
        </div>
      </div>
    </div>
  );
  const section3 = (
    <div className="homepage-section3-box">
      <div className="homepage-section3-title">Exploration First</div>
      <div className="homepage-section3-subtitle">
        Join us to experience advanced media features, connect with like-minded
        peers, and select courses that suit you. Make your learning journey more
        exciting and enriching!
      </div>
      <div className="homepage-section3-cards">
        <CardFlip />
      </div>
      <div className="homepage-section3-alt homepage-section3-subtitle">
        <div>COURSES:The most comprehensive course materials at UNSW.</div>
        <div>PROJECTS: The most project information at UNSW</div>
        <div>GROUPS: The widest range of group members at UNSW</div>
      </div>
    </div>
  );

  const sections = [section1, section2, section3];

  return (
    <>
      <div className="homepage-title-container">
        <div
          ref={(el) => (sectionsRef1.current[0] = el)}
          className="homepage-title-section homepage-hidden"
        >
          <div className="homepage-video-container">
            <video autoPlay loop muted className="homepage-background-video">
              <source src={homepage_background} />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>

      <div className="homepage-container">
        {sections.map((section, i) => (
          <section
            key={i}
            ref={(el) => (sectionsRef2.current[i] = el)}
            className="homepage-section homepage-hidden"
          >
            <div className="homepage-inner-div">{section}</div>
          </section>
        ))}
      </div>
    </>
  );
};

export default LandingPages;
