import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import "../App.css";
import homepage_project from "../assets/homepage-project.png";
import homepage_group from "../assets/homepage-group.png";
import homepage_course from "../assets/homepage-course.png";

// This component is used at the homepage, showing the filp card on site.
const FlipCard = ({
  frontContent,
  backContent,
  frontColor,
  backColor,
  index,
  animateFlip,
  resetFlip,
  cardH,
  cardW,
  marginT,
  paddingT,
  cName = ""
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (!isAnimating) {
      setIsFlipped(!isFlipped);
      setIsAnimating(true);
    }
  };

  useEffect(() => {
    if (animateFlip) {
      setTimeout(() => {
        setIsFlipped(true);
        // Rotate back after 1 second
        setTimeout(() => setIsFlipped(false), 2000);
      }, index * 400); // Stagger the animation
    }
  }, [animateFlip, index]);

  // Listen for resetFlip changes
  useEffect(() => {
    if (resetFlip) {
      setIsFlipped(false);
    }
  }, [resetFlip]);

  return (
    <div className={`flip-card ${cName}`} onClick={handleFlip}>
      <motion.div
        className="flip-card-inner"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        onAnimationComplete={() => setIsAnimating(false)}
      >
        <div
          className="flip-card-front"
          style={{
            background: frontColor,
            height: cardH,
            width: cardW,
            marginTop: marginT,
            paddingTop: paddingT,
            borderRadius: "20px"
          }}
        >
          {frontContent}
        </div>
        <div
          className="flip-card-back"
          style={{
            background: backColor,
            transform: "rotateY(180deg)",
            height: cardH,
            width: cardW,
            marginTop: marginT,
            paddingTop: paddingT,
            borderRadius: "20px"
          }}
        >
          {backContent}
        </div>
      </motion.div>
    </div>
  );
};

const CardFlip = () => {
  const [animateFlip, setAnimateFlip] = useState(false);
  const [resetFlip, setResetFlip] = useState(false);
  const containerRef = useRef(null);

  const resetAllFlips = useCallback(() => {
    setResetFlip(true);
    // Allow time for the flip to reset
    setTimeout(() => setResetFlip(false), 500);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimateFlip(true);
          } else {
            resetAllFlips();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [resetAllFlips]);

  return (
    <div className="homepage-section3-cards" ref={containerRef}>
      <FlipCard
        index={0}
        frontContent={
          <>
            <h1 className="homepage-cardfilp-title">COURSES</h1>

            <img
              src={homepage_course}
              alt=""
              style={{
                width: "100%",
                backgroundColor: "transparent",
                marginTop: "10px"
              }}
            />
          </>
        }
        backContent={
          <>
            <h1 className="homepage-cardfilp-title" style={{ color: "white" }}>
              COURSES
            </h1>
            <p
              className="homepage-cardfilp-text"
              style={{
                color: "white",
                paddingLeft: "15px",
                paddingRight: "15px"
              }}
            >
              The most comprehensive course materials at UNSW
            </p>
          </>
        }
        frontColor="linear-gradient(135deg, #a1c4fd, #c2e9fb)"
        backColor="linear-gradient(135deg, #fbc2eb, #a6c1ee)"
        animateFlip={animateFlip}
        resetFlip={resetFlip}
        cName="homepage-sidecards"
      />
      <FlipCard
        index={1}
        frontContent={
          <>
            <h1 className="homepage-cardfilp-title">PROJECTS</h1>

            <img
              src={homepage_project}
              alt=""
              style={{
                width: "100%",
                backgroundColor: "transparent",
                marginTop: "10px"
              }}
            />
          </>
        }
        backContent={
          <>
            <h1 className="homepage-cardfilp-title" style={{ color: "white" }}>
              PROJECTS
            </h1>
            <p
              className="homepage-cardfilp-text"
              style={{
                color: "white",
                paddingLeft: "15px",
                paddingRight: "15px"
              }}
            >
              The most project information at UNSW
            </p>
          </>
        }
        frontColor="linear-gradient(135deg, rgba(200, 230, 255, 0.5), rgba(180, 255, 210, 0.5))"
        backColor="linear-gradient(135deg, #d9a7c7, #fffcdc)"
        animateFlip={animateFlip}
        resetFlip={resetFlip}
       
        cName="homepage-middlecard"
      />
      <FlipCard
        index={2}
        frontContent={
          <>
            <h1 className="homepage-cardfilp-title">GROUPS</h1>
            <img
              src={homepage_group}
              alt=""
              style={{
                width: "100%",
                backgroundColor: "transparent",
                marginTop: "10px"
              }}
            />
          </>
        }
        backContent={
          <>
            <h1 className="homepage-cardfilp-title" style={{ color: "white" }}>
              GROUPS
            </h1>
            <p
              className="homepage-cardfilp-text"
              style={{
                color: "white",
                paddingLeft: "15px",
                paddingRight: "15px"
              }}
            >
              The widest range of group members at UNSW
            </p>
          </>
        }
        frontColor="linear-gradient(135deg, #a1c4fd, #c2e9fb)"
        backColor="linear-gradient(135deg, #fbc2eb, #a6c1ee)"
        animateFlip={animateFlip}
        resetFlip={resetFlip}
        cName="homepage-sidecards"
      />
    </div>
  );
};

export default CardFlip;
