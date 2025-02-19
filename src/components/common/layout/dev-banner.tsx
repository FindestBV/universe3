export const DevBanner = () => {
  return (
    <div className="relative p-4 text-center text-xl font-black uppercase text-white sm:text-2xl">
      {/* Warning Tape Background */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,_#FFD700_0px,_#FFD700_10px,_black_10px,_black_20px)] opacity-100"></div>

      {/* Text Wrapper with Better Visibility */}
      <span className="relative z-10 rounded-lg bg-black/70 p-2 shadow-lg">
        ⚠️ Temporary Route for Project Landing Page ⚠️
      </span>
    </div>
  );
};

export default DevBanner;
