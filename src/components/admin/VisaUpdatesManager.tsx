import React, { useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle, ExternalLink, Search, Globe } from "lucide-react";

interface VisaUpdate {
  id: number;
  date: string;
  tag: string;
  tag_bg: string;
  title: string;
  link: string;
  created_at?: string;
}

interface VisaUpdatesManagerProps {
  initialUpdates: VisaUpdate[];
}

export default function VisaUpdatesManager({ initialUpdates }: VisaUpdatesManagerProps) {
  const [updates, setUpdates] = useState<VisaUpdate[]>(initialUpdates || []);
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");
  const [tagColor, setTagColor] = useState("amber");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date.trim() || !tag.trim() || !title.trim() || !link.trim()) {
      showNotification("error", "Please fill in all visa bulletin fields.");
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-visa-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.trim(),
          tag: tag.trim(),
          tag_color: tagColor,
          title: title.trim(),
          link: link.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to add visa update");
      }

      const createdItem: VisaUpdate = data.item || {
        id: Date.now(),
        date: date.trim(),
        tag: tag.trim(),
        tag_bg: "bg-amber-100 text-amber-700 border-amber-200",
        title: title.trim(),
        link: link.trim(),
      };

      setUpdates((prev) => [createdItem, ...prev]);
      setTitle("");
      setLink("");
      showNotification("success", "Visa bulletin update posted instantly.");
    } catch (err: any) {
      showNotification("error", err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSingle = async (id: number) => {
    const confirmed = typeof window !== "undefined" && (window as any).showConfirmDialog
      ? await (window as any).showConfirmDialog({
          title: "Delete Visa Bulletin Update?",
          description: "Are you sure you want to delete this visa bulletin update? This action cannot be undone.",
          actionText: "Delete",
          cancelText: "Cancel",
          variant: "destructive",
          from: "bottom"
        })
      : confirm("Are you sure you want to delete this visa bulletin update?");

    if (!confirmed) return;

    setDeletingId(id);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-visa-updates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete update");
      }

      setUpdates((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showNotification("success", "Visa bulletin update removed successfully.");
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast("Visa bulletin update removed successfully.", "success");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to delete item.");
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(err.message || "Failed to delete item.", "error");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = typeof window !== "undefined" && (window as any).showConfirmDialog
      ? await (window as any).showConfirmDialog({
          title: "Delete Selected Visa Updates?",
          description: `Are you sure you want to delete ${selectedIds.length} selected visa updates? This action cannot be undone.`,
          actionText: "Delete",
          cancelText: "Cancel",
          variant: "destructive",
          from: "bottom"
        })
      : confirm(`Are you sure you want to delete ${selectedIds.length} selected visa updates?`);

    if (!confirmed) return;

    setIsBulkDeleting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-visa-updates", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete selected updates");
      }

      const toRemove = new Set(selectedIds);
      setUpdates((prev) => prev.filter((item) => !toRemove.has(item.id)));
      setSelectedIds([]);
      showNotification("success", `${selectedIds.length} visa updates deleted successfully.`);
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(`${selectedIds.length} visa updates deleted successfully.`, "success");
      }
    } catch (err: any) {
      showNotification("error", err.message || "Failed to bulk delete.");
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(err.message || "Failed to bulk delete.", "error");
      }
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const filteredUpdates = updates.filter(
    (item) =>
      (item?.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?.tag || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item?.date || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected =
    filteredUpdates.length > 0 &&
    filteredUpdates.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUpdates.map((item) => item.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all duration-200 ${
            notification.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-rose-50 border-rose-200 text-rose-700"
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-slate-400 hover:text-slate-600 text-sm font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" /> Post New Bulletin
          </h2>

          <form onSubmit={handleAdd} className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 uppercase tracking-wide">Publish Date *</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="e.g. Jan 15, 2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wide">Category Badge *</label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                  placeholder="e.g. CANADA PR"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 uppercase tracking-wide">Badge Color *</label>
                <select
                  value={tagColor}
                  onChange={(e) => setTagColor(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                >
                  <option value="amber">Amber Gold</option>
                  <option value="emerald">Emerald Green</option>
                  <option value="purple">Royal Purple</option>
                  <option value="cyan">Cyan Blue</option>
                  <option value="rose">Rose Red</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 uppercase tracking-wide">Bulletin Title *</label>
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="e.g. IRCC releases new PNP allocation figures for 2026..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 uppercase tracking-wide">Target URL Link *</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                placeholder="e.g. /blog/canada-pnp-2026 or https://..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" /> Post Bulletin
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Updates List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Published Bulletins</h2>
                <p className="text-slate-500 text-xs mt-0.5">{updates.length} total active bulletins</p>
              </div>

              {selectedIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  disabled={isBulkDeleting}
                  className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  {isBulkDeleting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete ({selectedIds.length})
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search bulletins by title, category, date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* List */}
            {filteredUpdates.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Globe className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">No visa bulletins found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <span>Select All</span>
                  </label>
                  <span>Action</span>
                </div>

                {filteredUpdates.map((item) => {
                  const isChecked = selectedIds.includes(item.id);
                  const isDeletingThis = deletingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? "bg-indigo-50/50 border-indigo-200"
                          : "bg-white border-slate-100 hover:border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0 pt-0.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(item.id)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 mt-0.5"
                        />
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${item?.tag_bg || "bg-amber-100 text-amber-700"}`}>
                              {item?.tag || "BULLETIN"}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{item?.date || ""}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 leading-snug">{item?.title || ""}</p>
                          {item?.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-indigo-600 hover:underline inline-flex items-center gap-1 font-medium"
                            >
                              <span>{item.link}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteSingle(item.id)}
                        disabled={isDeletingThis}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                        title="Delete Bulletin"
                      >
                        {isDeletingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
