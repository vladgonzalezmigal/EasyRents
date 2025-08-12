import { SVGIconProps } from '@/app/(private)/utils/styling';

export default function ChevronIcon({ style, className }: SVGIconProps) {
  return (
    <svg 
      width="48" 
      height="48" 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={className}
    >
      <path 
        d="M30 36L18 24L30 12" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
} 