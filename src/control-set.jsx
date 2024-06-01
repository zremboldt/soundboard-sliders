/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";

export const ControlSet = ({
  startingPosition,
  title,
  increments,
  lightColor,
}) => {
  const MIN = 0;
  const MAX = 100;
  const handleHeight = 84;

  const [value, setValue] = useState(startingPosition);
  const [indicatorValue, setIndicatorValue] = useState(startingPosition);
  const constraintsRef = useRef();
  const progressBarRef = useRef();
  const handleRef = useRef();

  const handleY = useMotionValue(0);
  const indicatorLightHeight = `${indicatorValue}%`;
  const sliderGlowPos = 80 + indicatorValue / 10;

  useEffect(() => {
    const newProgress = (MAX - value) / (MAX - MIN);
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();
    handleY.set(newProgress * progressBarBounds.height);
  }, [handleY, value]);

  const handleDragEnd = () => setIndicatorValue(value < 2.5 ? 2.5 : value);

  const handleDrag = () => {
    const handleBounds = handleRef.current.getBoundingClientRect();
    const middleOfHandle = handleBounds.top + handleBounds.height / 2;
    const progressBarBounds = progressBarRef.current.getBoundingClientRect();
    const progress =
      (middleOfHandle - progressBarBounds.top) / progressBarBounds.height; // Calculate the progress based on the middle of the handle relative to the invisible inner progress bar
    const reversedProgress = 1 - progress; // Reverse the progress
    const scaledProgress = Math.round(reversedProgress * (MAX - MIN)); // Scale the progress to the min-max range
    const clampedProgress = Math.min(MAX, Math.max(MIN, scaledProgress)); // Prevent values outside of 0-100 caused by dragElastic outside of the slider
    setValue(clampedProgress);
  };

  return (
    <div className="control-set">
      <div className="indicator-container">
        <div className="indicator-left">
          <div className="text-container">
            <label htmlFor={title}>{title}</label>
            {increments.map((increment) => (
              <span key={increment}>{increment}</span>
            ))}
          </div>
        </div>
        <div className="indicator-right">
          <div className="indicator-track">
            <motion.div
              className={`indicator-light ${lightColor}`}
              animate={{
                opacity: value / 20,
                height: indicatorLightHeight,
                transition: {
                  type: "spring",
                  damping: 20,
                },
              }}
            >
              <div className="indicator-light-inner" />
            </motion.div>
          </div>
        </div>
      </div>
      <div className="slider-container" ref={constraintsRef}>
        <div className="slider-track"></div>
        <div
          // This invisible progress bar is used to calculate the progress of the handle along the slider from the handle's centerpoint.
          ref={progressBarRef}
          style={{
            position: "absolute",
            top: `${handleHeight / 2}px`,
            bottom: `${handleHeight / 2}px`,
          }}
        />
        <motion.div
          drag="y"
          dragElastic={0.05}
          dragMomentum={false}
          dragConstraints={constraintsRef}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="slider-handle-container"
          ref={handleRef}
          style={{ height: `${handleHeight}px`, y: handleY }}
        >
          <div className="slider-handle-half-container">
            <motion.div
              animate={{
                opacity: indicatorValue < 20 ? indicatorValue / 50 : 0.5,
                offsetDistance: `${sliderGlowPos}%`,
                transition: { duration: 0.5 },
              }}
              className={`glow ${lightColor}`}
            />
            <div className="slider-handle-top-half"></div>
          </div>
          <div className="slider-handle-half-container">
            <motion.div
              animate={{
                opacity: indicatorValue < 20 ? indicatorValue / 50 : 0.5,
                offsetDistance: `${sliderGlowPos}%`,
                transition: { duration: 0.5 },
              }}
              className={`glow ${lightColor}`}
            />
            <div className="slider-handle-bottom-half"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
