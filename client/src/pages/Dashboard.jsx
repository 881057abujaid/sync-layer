import { useState } from "react";
import { FolderPlus, Upload, SlidersHorizontal } from "lucide-react";
import DashboardLayout from "../components/layout/DashboardLayout";
import useFiles from "../hooks/useFiles";
import FileGrid from "../components/file/FileGrid";
import UploadModal from "../components/upload/UploadModal";
import DropZone from "../components/upload/DropZone";
import Breadcrumb from "../components/file/Breadcrumb";
import CreateFolderModal from "../components/folder/CreateFolderModal";
import FilePreviewModal from "../components/preview/FilePreviewModal";
import StorageUsage from "../components/StorageUsage";
import { api } from "../services/api";
import FilterModal from "../components/file/FilterModal";
import toast from "react-hot-toast";

const Dashboard = () => {
    const [currentFolder, setCurrentFolder] = useState(null);
    const [showUpload, setShowUpload]       = useState(false);
    const [path, setPath]                   = useState([]);
    const [showCreate, setShowCreate]       = useState(false);
    const [previewFile, setPreviewFile]     = useState(null);
    const [filters, setFilters]             = useState({ sortBy: "created_at", order: "desc", type: "" });
    const [showFilter, setShowFilter]       = useState(false);
    const { files, folders, refresh }       = useFiles(currentFolder, "", filters);

    const handlePreview = async (file) => {
        try {
            const res = await api.get(`/files/${file.id}/download`);
            setPreviewFile({ ...file, downloadUrl: res.data.downloadUrl });
        } catch (error) {
            console.error("Error previewing file:", error.response || error);
            const msg = error.response?.data?.error || error.message || "Failed to preview file";
            toast.error(msg, { duration: 5000 }); // Show longer to allow reading path
        }
    };

    const openFolder = (folder) => {
        // ── Fix: Don't duplicate if already in path ──
        setPath((prev) => {
            const index = prev.findIndex((f) => f.id === folder.id);
            if (index !== -1) return prev.slice(0, index + 1);
            return [...prev, folder];
        });
        setCurrentFolder(folder.id);
    };

    const navigateTo = (folderId) => {
        if (folderId === null) {
            setCurrentFolder(null);
            setPath([]);
        } else {
            setCurrentFolder(folderId);
            setPath((prev) =>
                prev.slice(0, prev.findIndex((f) => f.id === folderId) + 1)
            );
        }
    };

    return (
        <DashboardLayout onPreview={handlePreview} openFolder={openFolder}>
            <DropZone folderId={currentFolder} refresh={refresh}>

                {/* ── Storage Usage ── */}
                <StorageUsage />

                {/* ── Breadcrumb ── */}
                <Breadcrumb path={path} onNavigate={navigateTo} />

                {/* ── Page Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight
                        bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                        bg-clip-text text-transparent">
                        {path.length > 0 ? path[path.length - 1].name : "My Files"}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2">

                        {/* New Folder */}
                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-1.5 h-9 px-[14px]
                                rounded-[9px] cursor-pointer
                                border border-blue-500/20
                                bg-gradient-to-r from-[#2563eb]/7 to-[#06b6d4]/7
                                text-[12.5px] font-semibold
                                transition-all duration-150 group
                                hover:from-[#2563eb] hover:to-[#06b6d4]
                                hover:text-white hover:border-transparent
                                hover:shadow-[0_2px_12px_rgba(37,99,235,0.3)]">
                            <FolderPlus
                                size={13}
                                className="text-blue-600 flex-shrink-0
                                    group-hover:text-white transition-colors"
                            />
                            <span className="hidden sm:block">
                                New Folder
                            </span>
                        </button>

                        {/* Upload */}
                        <button
                            onClick={() => setShowUpload(true)}
                            className="flex items-center gap-1.5 h-9 px-3 sm:px-[14px]
                                rounded-[9px] border-none cursor-pointer
                                bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                                text-white text-[12.5px] font-semibold
                                shadow-[0_2px_10px_rgba(37,99,235,0.28)]
                                hover:shadow-[0_4px_18px_rgba(37,99,235,0.42)]
                                hover:-translate-y-px
                                active:translate-y-0
                                transition-all duration-150">
                            <Upload size={13} />
                            <span className="hidden sm:block">Upload</span>
                        </button>

                        {/* Filter */}
                        <button
                            onClick={() => setShowFilter(true)}
                            className="flex items-center gap-1.5 h-9 px-3 sm:px-[14px]
                                rounded-[9px] border-none cursor-pointer
                                bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                                text-white text-[12.5px] font-semibold
                                shadow-[0_2px_10px_rgba(37,99,235,0.28)]
                                hover:shadow-[0_4px_18px_rgba(37,99,235,0.42)]
                                hover:-translate-y-px
                                active:translate-y-0
                                transition-all duration-150">
                            <SlidersHorizontal size={13} />
                            <span className="hidden sm:block">Filter</span>
                        </button>
                    </div>
                </div>

                {/* ── File Grid ── */}
                <FileGrid
                    files={files}
                    folders={folders}
                    onOpenFolder={openFolder}
                    refresh={refresh}
                    onPreview={handlePreview}
                />

                {/* ── Modals ── */}
                {showUpload && (
                    <UploadModal
                        onClose={() => setShowUpload(false)}
                        folderId={currentFolder}
                        refresh={refresh}
                    />
                )}
                {showCreate && (
                    <CreateFolderModal
                        parentId={currentFolder}
                        onClose={() => setShowCreate(false)}
                        refresh={refresh}
                    />
                )}
                {previewFile && (
                    <FilePreviewModal
                        file={previewFile}
                        onClose={() => setPreviewFile(null)}
                    />
                )}
                {showFilter && (
                    <FilterModal
                        filters={filters}
                        setFilters={setFilters}
                        onClose={() => setShowFilter(false)}
                    />
                )}
            </DropZone>
        </DashboardLayout>
    );
};

export default Dashboard;