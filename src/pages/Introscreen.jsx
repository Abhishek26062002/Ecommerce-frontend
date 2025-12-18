import { useEffect, useState } from "react";

const IntroScreen = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsPortrait(
        window.matchMedia("(orientation: portrait)").matches &&
        window.innerWidth < 1024
      );
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center z-50"
      style={{
        backgroundImage: `url('${
          isPortrait
            ? "https://res.cloudinary.com/dobuwrfn8/image/upload/v1766048280/osalogobg_q33d14.jpg"
            : "https://res.cloudinary.com/dobuwrfn8/image/upload/v1766046076/osalogobg_hs5rj7.jpg"
        }')`,
        backgroundRepeat: "repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "top center",
        backgroundSize: isPortrait ? "contain" : "cover",
      }}
    >
      <img
        src="https://res.cloudinary.com/dobuwrfn8/image/upload/v1764486573/OSA_LOGO_ANIMATION1_eohmjx.gif"
        alt="Intro Animation"
        className="w-[350px] max-w-full h-auto"
      />
    </div>
  );
};

export default IntroScreen;
