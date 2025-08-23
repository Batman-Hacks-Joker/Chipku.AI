import { cn } from "@/lib/utils";

export const BranchIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      width="151"
      height="150"
      viewBox="0 0 151 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("absolute -right-5 -bottom-5 text-card-foreground/10", className)}
    >
      <path
        d="M150 150V-2.5C150 -2.5 106.398 29.5304 90.5 52.5C77.5 71.5 82.5 108 81 123C79.5 138 69.5 143.5 69.5 143.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M81 123C81 123 54.5 119.5 40 102C25.5 84.5 35 53 35 53"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="27" cy="46" r="12" fill="#F3D5E2" stroke="currentColor" strokeWidth="2" />
      <path
        d="M39.8885 101.889C39.8885 101.889 23.5 97 14.5 81.5C5.5 66 -4.5 48 -4.5 48"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="14" cy="81" r="9" fill="#F3D5E2" stroke="currentColor" strokeWidth="2" />
      <circle cx="1" cy="43" r="10" fill="#E5E6E4" stroke="currentColor" strokeWidth="2" />
      <path
        d="M90 52C90 52 74 43 65.5 28C57 -7 28 -7.5 28 -7.5"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle cx="65" cy="27" r="10" fill="#CBDFBD" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};
