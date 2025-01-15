import logoUniverse from "@/assets/universe_logo_color.png";
import Login from "@/components/shared/login";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-gray-100 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <a href="https://findest.com" target="_blank" rel="noreferrer noopener">
          <img alt="Universe, by Findest" src={logoUniverse} className="mx-auto h-20 w-auto" />
        </a>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Login />

        <p className="mt-10 text-center text-sm/6 text-gray-400">
          Forgot your password?{" "}
          <a href="#" className="font-semibold text-black hover:text-blue-500">
            Click here to reset
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
