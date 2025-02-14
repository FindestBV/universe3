import Login from "@/components/common/login";

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center bg-gray-100 bg-[linear-gradient(to_bottom_right,black_0%,black_20%,#60a5fa_50%,white_70%,#facc15_100%)] px-6 py-12 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
