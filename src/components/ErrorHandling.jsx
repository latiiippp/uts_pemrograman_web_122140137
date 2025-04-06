import React from "react";
import {
  FaExclamationTriangle,
  FaWifi,
  FaServer,
  FaSearch,
} from "react-icons/fa";

const ErrorMessage = ({ type, message, retry }) => {
  const getErrorContent = () => {
    switch (type) {
      case "network":
        return {
          icon: <FaWifi size={36} className="text-yellow-500 mb-4" />,
          title: "Network Error",
          description:
            message ||
            "Unable to connect to the server. Please check your internet connection.",
        };
      case "server":
        return {
          icon: <FaServer size={36} className="text-red-500 mb-4" />,
          title: "Server Error",
          description:
            message || "Our server is having issues. Please try again later.",
        };
      case "notFound":
        return {
          icon: <FaSearch size={36} className="text-blue-500 mb-4" />,
          title: "Not Found",
          description: message || "The requested resource could not be found.",
        };
      default:
        return {
          icon: (
            <FaExclamationTriangle size={36} className="text-orange-500 mb-4" />
          ),
          title: "Error",
          description: message || "Something went wrong. Please try again.",
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
      {icon}
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-4">{description}</p>
      {retry && (
        <button
          onClick={retry}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          aria-label="Retry loading data"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
