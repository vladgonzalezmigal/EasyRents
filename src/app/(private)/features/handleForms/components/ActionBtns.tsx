'use client';

import TrashIcon from "@/app/(private)/components/svgs/TrashIcon";
import EditIcon from "@/app/(private)/components/svgs/EditIcon";

interface DeleteBtnConfig {
    handleDelete: () => void;
    deleteMode: boolean;
    canDelete: boolean;
}

interface EditBtnConfig {
    handleEdit: () => void;
    editMode: boolean;
    validationErrors: Record<number, Set<number>>;
}

interface ActionBtnsProps {
    deleteBtnConfig?: DeleteBtnConfig;
    editBtnConfig: EditBtnConfig;
    cudLoading: boolean;
}

export default function ActionBtns({
    deleteBtnConfig,
    editBtnConfig,
    cudLoading
}: ActionBtnsProps) {
    const { handleDelete, deleteMode, canDelete } = deleteBtnConfig || {};
    const { handleEdit, editMode, validationErrors } = editBtnConfig; 

    const clearEdits = (Object.keys(validationErrors).length > 0);

    return (
        <div className="w-full relative h-[148px] bg-[#F2FBFA] border border-t-0 border-[#ECECEE] header-shadow rounded-bottom z-0 mt-[-20px]">
            <div className="flex flex-row gap-x-4 items-center justify-center absolute bottom-4 left-1/2 transform -translate-x-1/2 ">
                {/* Delete Button */}
                {deleteBtnConfig && (
                    <div className="flex flex-col items-center gap-y-2">
                        <button
                            onClick={handleDelete}
                        disabled={cudLoading}
                        className={`cursor-pointer rounded-full w-16 h-16 border-2 border-[#A72020] flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                            deleteMode ? 'bg-[#FA7B7D]' : '  bg-[#F8D2D2]'
                            }`}>
                        {cudLoading ?
                            <span className="text-white">...</span> :
                            <span className="text-white">
                                <TrashIcon className={deleteMode ? (canDelete ? "text-[#A72020]" : "text-[#ffffff]") : "text-[#A72020]"} />
                            </span>
                        }
                    </button>
                        <p className="action-btn-text"> Delete </p>
                    </div>
                )}
                {/* Edit Button */}
                <div className="flex flex-col items-center gap-y-2">
                    <button
                        onClick={handleEdit}
                        disabled={cudLoading}
                        className={`cursor-pointer rounded-full w-16 h-16 border-2 border-[#0C3C74] flex items-center justify-center ${cudLoading ? 'bg-gray-400' :
                            editMode ? (clearEdits ? 'bg-blue-200' : 'bg-blue-500') : 'bg-blue-200'
                            }`}>
                        {cudLoading ?
                            <span className="text-white">...</span> :
                            <span className="text-white">
                                <EditIcon className={
                                    cudLoading ? "text-gray-400" :
                                    editMode ? (clearEdits ? "text-[#0C3C74]" : "text-white") : "text-[#0C3C74]"
                                } />
                            </span>
                        }
                    </button>
                    <p className="action-btn-text"> Edit </p>
                </div>
            </div>
        </div>
    );
}
