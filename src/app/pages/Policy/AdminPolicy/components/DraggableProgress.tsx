import React, { useState, useRef, useEffect } from "react";

interface DraggableProgressProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

const DraggableProgress: React.FC<DraggableProgressProps> = ({
  value,
  min = 0,
  max = 100,
  onChange,
  disabled = false,
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || disabled) return;
    updateValue(e);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      onChange(currentValue);
    }
  };

  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const newValue = Math.round((percentage / 100) * (max - min) + min);

    setCurrentValue(newValue);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) return;
    updateValue(e);
    onChange(currentValue);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((currentValue - min) / (max - min)) * 100;

  return (
    <div className={`relative ${className}`}>
      <div
        ref={progressRef}
        className={`relative h-3 bg-gray-200 rounded-full cursor-pointer ${
          disabled ? "cursor-not-allowed opacity-60" : ""
        }`}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
      >
        <div
          className="h-full bg-gray-400 rounded-full transition-all duration-200"
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full shadow-md ${
            isDragging ? "scale-110" : ""
          } transition-transform duration-200`}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span>{min}%</span>
        <span className="font-medium">{currentValue}%</span>
        <span>{max}%</span>
      </div>
    </div>
  );
};

export default DraggableProgress;
