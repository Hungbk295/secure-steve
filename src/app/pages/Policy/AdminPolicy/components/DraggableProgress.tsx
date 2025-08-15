import { useCallback, useRef, useState, useEffect } from "react";
import { Progress, Typography, Tooltip } from "antd";

const { Text } = Typography;

interface DraggableProgressProps {
  value: number;
  minValue: number;
  maxValue?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function DraggableProgress({
  value,
  minValue,
  maxValue = 100,
  onChange,
  disabled = false,
}: DraggableProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const calculateValueFromPosition = useCallback(
    (clientX: number) => {
      if (!progressRef.current) return value;

      const rect = progressRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const newValue = Math.round(percentage * maxValue);

      // Enforce minimum constraint
      return Math.max(minValue, newValue);
    },
    [maxValue, minValue, value]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;

      e.preventDefault();
      setIsDragging(true);

      const newValue = calculateValueFromPosition(e.clientX);
      setTempValue(newValue);
    },
    [disabled, calculateValueFromPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;

      const newValue = calculateValueFromPosition(e.clientX);
      setTempValue(newValue);
    },
    [isDragging, disabled, calculateValueFromPosition]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    onChange(tempValue);
  }, [isDragging, tempValue, onChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const displayValue = isDragging ? tempValue : value;
  const isValidValue = displayValue >= minValue;
  const strokeColor = isValidValue ? "#1890ff" : "#ff4d4f";

  return (
    <div className="draggable-progress">
      <div className="flex flex-wrap gap-2 w-full">
        <div className="flex-1 min-w-[200px] sm:min-w-0 sm:w-auto">
          <Tooltip title={`${displayValue}% (Min: ${minValue}%)`}>
            <div
              ref={progressRef}
              className={`flex-1 ${
                !disabled ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              onMouseDown={handleMouseDown}
              style={{ userSelect: "none" }}
            >
              <Progress
                percent={displayValue}
                showInfo={false}
                strokeColor={strokeColor}
                trailColor="#f0f0f0"
                strokeWidth={12}
                className="draggable-progress-bar"
              />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="min-w-16 text-right sm:text-left w-full sm:w-auto">
        <Text
          strong
          style={{
            color: isValidValue ? "#1890ff" : "#ff4d4f",
            fontSize: "14px",
          }}
        >
          {displayValue}%
        </Text>
      </div>

      {!isValidValue && (
        <Text type="danger" className="text-xs mt-1 block">
          Must be ≥ {minValue}%
        </Text>
      )}

      {isDragging && (
        <Text className="text-xs text-gray-500 mt-1 block">
          Dragging... Release to set value
        </Text>
      )}
    </div>
  );
}

export default DraggableProgress;
