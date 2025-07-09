import React, { useState, useEffect, useRef } from "react";

interface SlideContent {
  image: string;
  title?: string;
  price?: string;
  discount?: string;
}

interface BannerCarouselProps {
  slides: SlideContent[];
  autoPlay?: boolean;
  delay?: number; // milliseconds
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({
  slides,
  autoPlay = true,
  delay = 5000,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(delay / 1000);

  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setRemainingTime(delay / 1000);
    startTimeRef.current = null;
  };

  const goToNext = () => {
    goToSlide((activeIndex + 1) % slides.length);
  };

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / delay, 1);
    const remaining = Math.max(((delay - elapsed) / 1000), 0);
    setRemainingTime(remaining);

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      goToNext();
    }
  };

  useEffect(() => {
    if (!autoPlay) return;

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeIndex, autoPlay, delay]);

  const progressPercent = (1 - remainingTime / (delay / 1000)) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-background">
      {/* Slides */}
      <div className="w-full h-full relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex transition-opacity border-y border-ring/30 duration-700 px-6 py-4 ${
              index === activeIndex ? "opacity-100 " : "opacity-0 z-0"
            }`}
          >
            {/* Image */}
            <div className="w-1/2 h-full flex items-center justify-center">
              <img
                src={slide.image}
                alt={`Slide ${index}`}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Content */}
            <div className="w-1/2 h-full flex flex-col justify-center items-start p-4 relative">
              <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
              <p className="text-lg font-semibold text-green-600">{slide.price}</p>
              <p className="text-sm text-red-500">{slide.discount}</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                Shop Now
              </button>

              {/* Circular Timer */}
              <div className="absolute bottom-4 right-4">
                <svg width="50" height="50" className="text-foreground">
                  <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth="4"
                    fill="none"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r={radius}
                    stroke="#3b82f6"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.05s linear" }}
                  />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="12"
                    fill="currentColor"
                    fontWeight="bold"
                  >
                    {Math.ceil(remainingTime)}s
                  </text>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === activeIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() =>
          goToSlide(activeIndex === 0 ? slides.length - 1 : activeIndex - 1)
        }
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20"
      >
        ‹
      </button>
      <button
        onClick={() => goToSlide((activeIndex + 1) % slides.length)}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 z-20"
      >
        ›
      </button>
    </div>
  );
};

export default BannerCarousel;
