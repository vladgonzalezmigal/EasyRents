import LoadingWave from "@/app/components/LoadingWave";

interface EmailLoadProps {
  receiver: string;
}

export default function EmailLoad({ receiver }: EmailLoadProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <p className="text-2xl text-[#2A7D7B] font-medium">
        Sending email to {receiver}...
      </p>
      <div className="text-[#2A7D7B]">
        <LoadingWave />
      </div>
    </div>
  );
}
