import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F5EF] px-4">
      <div className="w-full max-w-lg text-center">
        {/* 404 */}
        <p className="text-8xl font-bold tracking-tight text-[#031008] sm:text-9xl">
          404
        </p>

        {/* Title */}
        <h1 className="mt-6 text-3xl font-semibold text-[#031008] sm:text-4xl">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-600">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Back Home */}
        <Link
          to="/"
          className="
            mt-8
            inline-flex
            items-center
            justify-center
            rounded-md
            bg-[#031008]
            px-6
            py-3
            text-sm
            font-medium
            text-white
            transition-colors
            duration-200
            hover:bg-[#33473B]
            focus:outline-none
            focus:ring-2
            focus:ring-[#33473B]
            focus:ring-offset-2
          "
        >
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;