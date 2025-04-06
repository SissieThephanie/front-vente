import { useEffect } from "react";

export default function Alert({ message, type, onClose, duration = 3000 }) {
  const alertClasses = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div role="alert" className={`alert ${alertClasses[type]} shadow-lg`}>
      <span>{message}</span>
      <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
    </div>
  );
}