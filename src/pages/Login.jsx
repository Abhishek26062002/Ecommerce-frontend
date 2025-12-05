import { useLocation } from "react-router-dom";

const LoginModal = ({ onClose }) => {
  const location = useLocation();
  const redirectPath = location.state?.from || "/";

  const handleGoogleLogin = () => {
    localStorage.setItem("redirectPath", redirectPath);
    window.location.href = "https://ecommerce-six-omega.vercel.app/auth/login";
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-999 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-sm px-2 py-1 cursor-pointer font-bold rounded-full hover:bg-gray-200 transition-all"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Welcome</h2>
        <p className="text-gray-600 mb-8 text-center">Sign in with Google to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 font-semibold hover:bg-gray-100 transition-all"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="google"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
