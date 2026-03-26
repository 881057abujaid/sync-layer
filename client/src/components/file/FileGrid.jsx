import FileCard from "./FileCard";
import FolderCard from "./FolderCard";
import { FileX } from "lucide-react";

const FileGrid = ({ files, folders, onOpenFolder, refresh, onPreview }) => {
    const isEmpty = !folders?.length && !files?.length;

    return (
        <>
            {/* ── Empty State ── */}
            {isEmpty && (
                <div className="flex flex-col items-center justify-center
                    py-16 gap-3 rounded-[16px] glass-panel
                    shadow-[0_4px_24px_rgba(37,99,235,0.06)]">
                    <div className="w-12 h-12 rounded-[14px] flex items-center
                        justify-center
                        bg-gradient-to-br from-[#2563eb]/8 to-[#06b6d4]/8">
                        <FileX size={22} className="text-blue-400" />
                    </div>
                    <p className="text-[14px] font-medium text-slate-400">
                        No files or folders here
                    </p>
                    <p className="text-[12px] text-slate-300">
                        Upload a file or create a folder to get started
                    </p>
                </div>
            )}

            {/* ── Folders Section ── */}
            {folders?.length > 0 && (
                <div className="mb-5">
                    <p className="text-[11px] font-semibold text-slate-400
                        uppercase tracking-[0.8px] mb-3 px-0.5">
                        Folders
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {folders.map((folder) => (
                            <FolderCard
                                key={folder.id}
                                folder={folder}
                                onOpen={onOpenFolder}
                                refresh={refresh}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Files Section ── */}
            {files?.length > 0 && (
                <div>
                    <p className="text-[11px] font-semibold text-slate-400
                        uppercase tracking-[0.8px] mb-3 px-0.5">
                        Files
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {files.map((file) => (
                            <FileCard
                                key={file.id}
                                file={file}
                                refresh={refresh}
                                onPreview={onPreview}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default FileGrid;