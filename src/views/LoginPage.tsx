import Login from '@/components/login';
import logoUniverse from '@/assets/universe_logo_color.png';
import { LoginImageSlider } from '@/components/login/login-image-slider';

export const LoginPage = () => {
  return (
    <div className="grid grid-cols-5 w-full h-full">
      {/* Left Panel: 3/5 of the width */}
      <div className="col-span-3 bg-[#395fa7] flex items-center justify-center">
        <LoginImageSlider />
      </div>

      {/* Right Panel: 2/5 of the width */}
      <div className="col-span-2 flex flex-col items-center justify-center">
        <div className="flex mx-auto w-full p-6 items-center justify-center">
          <a href="/" rel="preload"><img src={logoUniverse} alt="Findest logo" width="130px" height="45px" className="items-center justify-center" /></a>
        </div>
        <div className="w-full max-w-md">
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
