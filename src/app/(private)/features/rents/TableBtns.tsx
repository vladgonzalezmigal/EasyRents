'use client';

import PayrollIcon from "../../components/svgs/PayrollIcon";
import SaveIcon from "../../components/svgs/SaveIcon";
import MaximizeIcon from "../../components/svgs/MaximizeIcon";
import MinimizeIcon from "../../components/svgs/MinimizeIcon";

interface PayrollBtnsProps {
    hasEdits: boolean;
    onSync: () => void;
    onSave: () => void; 
    enlarged: Boolean; 
    loading: boolean;
    setEnlarged: React.Dispatch<React.SetStateAction<boolean>>; 
}

export default function TableBtns({
    hasEdits,
    onSync,
    onSave, 
    enlarged,
    loading,
    setEnlarged
}: PayrollBtnsProps) {

    return (
        <div className="w-[800px]">
            <div className="w-full relative h-[148px] bg-[#F2FBFA] border border-t-0 border-[#ECECEE] header-shadow rounded-bottom z-0 mt-[-20px]">
                <div className="flex flex-row gap-x-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    {/* Sync Button */}
                    <div className="flex flex-col items-center gap-y-2">
                        <button
                            onClick={onSync}
                            disabled={hasEdits}
                            className={`${hasEdits ? 'cursor-not-allowed' : 'cursor-pointer'} rounded-full w-16 h-16 border-2 border-[#8ABBFD] bg-[#DFF4F3] flex items-center justify-center`}
                        >
                            <span className="text-white">
                                <PayrollIcon className="text-[#8ABBFD] w-10 h-10" />
                            </span>
                        </button>
                        <p className="action-btn-text">Sync</p>
                    </div>
                    {/* Save Button */}
                    <div className="flex flex-col items-center gap-y-2">
                        <button
                            onClick={onSave}
                            disabled={!hasEdits || loading}
                            className={`rounded-full w-16 h-16 border-2 border-orange-500 ${(!hasEdits || loading) ? 'opacity-50' : 'bg-orange-100 cursor-pointer shadow-[0_0_12px_2px_rgba(255,140,0,0.25)]'} flex items-center justify-center`}
                        >
                            <span className="text-orange-500">
                                <SaveIcon />
                            </span>
                        </button>
                        <p className="action-btn-text">Save</p>
                    </div>
                </div>
                <div className="absolute bottom-4 right-4 flex flex-col items-center gap-y-2">
                    {/* Maximize/Minimize Button */}
                    <button
                        onClick={() => setEnlarged(prev => !prev)}
                        className="cursor-pointer rounded-full w-16 h-16 border-2 border-[#8ABBFD] bg-[#DFF4F3] flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        {enlarged ? (
                            <MinimizeIcon className="w-10 h-10 text-[#80848A]" />
                        ) : (
                            <MaximizeIcon className="w-10 h-10 text-[#80848A]" />
                        )}
                    </button>
                    <p className="action-btn-text">{enlarged ? 'Minimize' : 'Maximize'}</p>
                </div>
            </div>
        </div>
    );
}