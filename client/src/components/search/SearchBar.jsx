import { useState, useEffect, useRef } from "react";
import { Search, X, Folder, FileText, Loader2 } from "lucide-react";
import useSearch from "../../hooks/useSearch";

const SearchBar = ({ onPreview, openFolder }) => {
    const [query, setQuery]   = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { results, loading } = useSearch(query);
    const searchRef            = useRef(null);

    const files   = results?.files   || [];
    const folders = results?.folders || [];
    const hasResults = folders.length > 0 || files.length > 0;

    // ── Open/close on query change ────────────────────────
    useEffect(() => {
        setIsOpen(query.length > 0);
    }, [query]);

    // ── Outside click close ───────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target))
                setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const clearSearch = () => { setQuery(""); setIsOpen(false); };

    return (
        <div className="relative w-full" ref={searchRef}>

            {/* ── Input ── */}
            <div className="relative flex items-center">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2
                        text-slate-400 pointer-events-none"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder="Search..."
                    className="w-full h-[40px] rounded-[10px] pl-[34px] sm:pl-[38px] pr-8 sm:pr-9
                        text-[12.5px] sm:text-[13.5px] text-slate-700
                        bg-white/75 backdrop-blur-[12px]
                        border border-blue-500/15
                        placeholder:text-slate-400
                        focus:outline-none focus:border-blue-500/40
                        focus:bg-white/95
                        focus:ring-[3px] focus:ring-blue-500/8
                        transition-all duration-150"
                />

                {/* Clear button */}
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-[10px] top-1/2 -translate-y-1/2
                            w-5 h-5 rounded-[5px] flex items-center justify-center
                            bg-blue-500/6 text-slate-400 cursor-pointer
                            hover:bg-blue-500/12 hover:text-blue-600
                            transition-all duration-150">
                        <X size={10} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* ── Dropdown ── */}
            {isOpen && query && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full
                    max-h-[60vh] overflow-y-auto z-[99999]
                    bg-white/90 backdrop-blur-[28px]
                    border border-white/90 rounded-[14px]
                    shadow-[0_12px_36px_rgba(37,99,235,0.13)]
                    py-2 flex flex-col">

                    {/* Folders */}
                    {folders.length > 0 && (
                        <div className="mb-1">
                            <p className="text-[10px] font-semibold text-slate-400
                                uppercase tracking-[0.8px] px-3.5 py-1.5">
                                Folders
                            </p>
                            {folders.map((folder) => (
                                <div
                                    key={folder.id}
                                    onClick={() => {
                                        openFolder(folder);
                                        clearSearch();
                                    }}
                                    className="flex items-center gap-2.5
                                        px-3.5 py-2 cursor-pointer
                                        hover:bg-blue-500/4
                                        transition-colors duration-100">
                                    <div className="icon-box rounded-[8px] w-[30px] h-[30px]">
                                        <Folder size={15} className="text-blue-600" />
                                    </div>
                                    <span className="text-[13px] font-medium
                                        text-slate-600 truncate">
                                        {folder.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Divider between sections */}
                    {folders.length > 0 && files.length > 0 && (
                        <div className="h-px bg-blue-500/6 my-1" />
                    )}

                    {/* Files */}
                    {files.length > 0 && (
                        <div>
                            <p className="text-[10px] font-semibold text-slate-400
                                uppercase tracking-[0.8px] px-3.5 py-1.5">
                                Files
                            </p>
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => {
                                        onPreview(file);
                                        clearSearch();
                                    }}
                                    className="flex items-center gap-2.5
                                        px-3.5 py-2 cursor-pointer
                                        hover:bg-teal-500/4
                                        transition-colors duration-100">
                                    <div className="w-[30px] h-[30px] rounded-[8px]
                                        flex items-center justify-center flex-shrink-0
                                        bg-teal-500/8">
                                        <FileText size={15} className="text-teal-600" />
                                    </div>
                                    <span className="text-[13px] font-medium
                                        text-slate-600 truncate">
                                        {file.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Loading */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center
                            py-8 gap-2.5">
                            <Loader2
                                size={20}
                                className="text-blue-400 animate-spin"
                            />
                            <p className="text-[12.5px] text-slate-400 font-medium">
                                Searching...
                            </p>
                        </div>
                    )}

                    {/* No results */}
                    {!hasResults && !loading && (
                        <div className="flex flex-col items-center justify-center
                            py-8 gap-2">
                            <div className="w-10 h-10 rounded-[12px]
                                flex items-center justify-center
                                bg-blue-500/6">
                                <Search size={18} className="text-blue-300" />
                            </div>
                            <p className="text-[13px] text-slate-400">
                                No results for{" "}
                                <span className="font-semibold text-slate-500">
                                    "{query}"
                                </span>
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;