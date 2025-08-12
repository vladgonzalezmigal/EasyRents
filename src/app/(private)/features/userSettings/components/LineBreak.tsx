interface LineBreakProps {
  className?: string;
}

export default function LineBreak({ className }: LineBreakProps) {
  return (
    <div 
      className={`w-[900px] h-[1.5px] bg-[#DADADA] rounded-full ${className || ''}`}
    />
  );
}
