import { cn } from "@/lib/utils/cn";

type MockMapProps = {
  className?: string;
  height?: "sm" | "md" | "lg";
  fill?: boolean;
  showRoute?: boolean;
  showPins?: boolean;
};

export function MockMap({
  className,
  height = "md",
  fill = false,
  showRoute = false,
  showPins = true,
}: MockMapProps) {
  return (
    <div
      className={cn(
        "mock-map",
        fill && "mock-map-fill",
        !fill && height === "sm" && "mock-map-sm",
        !fill && height === "md" && "mock-map-md",
        !fill && height === "lg" && "mock-map-lg",
        className,
      )}
    >
      <div className="mock-map-grid" aria-hidden />
      {showRoute && (
        <svg
          className="mock-map-route"
          viewBox="0 0 400 200"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M 30 150 Q 140 110 220 80 T 370 40"
            fill="none"
            stroke="var(--mock-brand)"
            strokeWidth="3"
            strokeDasharray="8 5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {showPins && (
        <>
          <span
            className="mock-map-pin mock-map-pin-lg"
            style={{ left: "26%", top: "58%" }}
            aria-hidden
          />
          <span
            className="mock-map-pin mock-map-pin-alt"
            style={{ left: "64%", top: "34%" }}
            aria-hidden
          />
        </>
      )}
      <span className="mock-map-label">Google Maps ルート案内に対応</span>
    </div>
  );
}
