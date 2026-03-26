import { useState } from "react";
import { createPortal } from "react-dom";
import { SlidersHorizontal, ArrowUpDown, FileType, X, Check } from "lucide-react";
import { toast } from "react-hot-toast";

// ── Config ────────────────────────────────────────────────
const sortOptions = [
    { value: "created_at", label: "Date Created" },
    { value: "name",       label: "Name"         },
    { value: "size_bytes", label: "File Size"    },
];

const orderOptions = [
    { value: "desc", label: "Newest First" },
    { value: "asc",  label: "Oldest First" },
];

const typeOptions = [
    { value: "",               label: "All Files" },
    { value: "image",          label: "Images"    },
    { value: "video",          label: "Videos"    },
    { value: "audio",          label: "Audio"     },
    { value: "application/pdf", label: "PDF"      },
];

// ── Pill Selector ─────────────────────────────────────────
const PillGroup = ({ options, value, onChange }) => (
    <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
            const isActive = value === opt.value;
            return (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`px-3 py-1.5 rounded-[8px] text-[12px] font-semibold
                        border cursor-pointer transition-all duration-150
                        ${isActive
                            ? "bg-gradient-to-r from-[#2563eb]/11 to-[#06b6d4]/9 border-blue-500/20 text-blue-600"
                            : "bg-white/60 border-blue-500/10 text-slate-500 hover:border-blue-500/15 hover:bg-blue-500/5"
                        }`}>
                    {opt.label}
                </button>
            );
        })}
    </div>
);

// ── Section Label ─────────────────────────────────────────
const Section = ({ icon: Icon, label, children }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
            <Icon size={12} className="text-slate-400 flex-shrink-0" />
            <p className="text-[11.5px] font-semibold text-slate-500 uppercase
                tracking-[0.4px]">
                {label}
            </p>
        </div>
        {children}
    </div>
);

// ── Main Component ────────────────────────────────────────
const FilterModal = ({ filters, setFilters, onClose }) => {
    const [local, setLocal] = useState(filters);

    const handleApply = () => {
        setFilters(local);
        toast.success("Filters applied");
        onClose();
    };

    const handleReset = () => {
        const reset = { sortBy: "created_at", order: "desc", type: "" };
        setLocal(reset);
        setFilters(reset);
        toast.success("Filters reset");
        onClose();
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center
                bg-black/25 backdrop-blur-[4px]"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-[340px] bg-white/85 backdrop-blur-[32px]
                border border-white/90 rounded-[20px]
                shadow-[0_16px_48px_rgba(37,99,235,0.15)]
                p-6">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-[9px] flex items-center
                            justify-center flex-shrink-0
                            bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/8">
                            <SlidersHorizontal size={15} className="text-blue-600" />
                        </div>
                        <h2 className="text-[15px] font-semibold text-slate-700">
                            Sort & Filter
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-[7px] flex items-center
                            justify-center text-slate-400 cursor-pointer
                            border border-transparent flex-shrink-0
                            hover:bg-red-500/7 hover:border-red-400/15
                            hover:text-red-400 transition-all duration-150">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Sections ── */}
                <div className="flex flex-col gap-4">
                    <Section icon={ArrowUpDown} label="Sort By">
                        <PillGroup
                            options={sortOptions}
                            value={local.sortBy}
                            onChange={(v) => setLocal((f) => ({ ...f, sortBy: v }))}
                        />
                    </Section>

                    <Section icon={ArrowUpDown} label="Order">
                        <PillGroup
                            options={orderOptions}
                            value={local.order}
                            onChange={(v) => setLocal((f) => ({ ...f, order: v }))}
                        />
                    </Section>

                    <Section icon={FileType} label="File Type">
                        <PillGroup
                            options={typeOptions}
                            value={local.type}
                            onChange={(v) => setLocal((f) => ({ ...f, type: v }))}
                        />
                    </Section>
                </div>

                {/* ── Actions ── */}
                <div className="flex items-center gap-2 mt-5">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 h-[38px] rounded-[9px] cursor-pointer
                            border border-blue-500/15 bg-slate-50/80
                            text-[13px] font-semibold text-slate-500
                            hover:bg-slate-100/80 hover:text-slate-600
                            transition-all duration-150">
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleApply}
                        className="flex-1 h-[38px] rounded-[9px] cursor-pointer
                            flex items-center justify-center gap-1.5
                            bg-gradient-to-r from-[#2563eb] to-[#06b6d4]
                            text-white text-[13px] font-semibold
                            shadow-[0_2px_10px_rgba(37,99,235,0.28)]
                            hover:shadow-[0_4px_18px_rgba(37,99,235,0.4)]
                            hover:-translate-y-px active:translate-y-0
                            transition-all duration-150">
                        <Check size={14} />
                        Apply
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default FilterModal;