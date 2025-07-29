import { cn } from "@/libs/utils";
import { useAppSelector } from "@/store";
import { selectActionIsNavCollapsed } from "@/store/appSlide";
import { useEffect, useState, useRef } from "react";

interface IFixedConditionProps {
  condition: any;
  title: string;
}

function FixedCondition(props: IFixedConditionProps) {
  const { condition: Condition, title } = props;
  const isNavCollapsed = useAppSelector(selectActionIsNavCollapsed);
  const [isFixed, setIsFixed] = useState(false);
  const conditionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (conditionRef.current) {
        const elementPosition = conditionRef.current.offsetTop - 5;
        const scrollPosition = window.scrollY;
        setIsFixed(scrollPosition >= elementPosition);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {!isFixed && <h3 className="text-grey-40 font-medium mt-6">Search</h3>}
      <div
        ref={conditionRef}
        className={cn(
          "transition-[box-shadow,width] duration-300",
          isFixed && "sticky top-0 z-10 flex flex-col items-center"
        )}
      >
        <div
          className={cn(
            "bg-white p-6 transition-[box-shadow,width] duration-300",
            !isFixed
              ? "rounded-lg mt-2 border border-grey-10"
              : "w-[calc(100vw-256px)] shadow-[0px_4px_8px_0px_#82828A3D] px-10",
            isFixed && isNavCollapsed && "w-[calc(100vw-80px)]"
          )}
        >
          {isFixed && (
            <h1 className="font-bold text-2xl text-grey-80 leading-custom-normal mb-4">
              {title}
            </h1>
          )}
          <Condition />
        </div>
      </div>
    </>
  );
}

export default FixedCondition;
