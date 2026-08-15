import React, { useState } from "react";
import { Plus, Trash2, Loader2, CheckCircle2, AlertCircle, Megaphone, Search } from "lucide-react";

interface Announcement {
  id: number;
  text: string;
  created_at?: string;
}

interface AnnouncementsManagerProps {
  initialAnnouncements: Announcement[];
}

export default function AnnouncementsManager({ initialAnnouncements }: AnnouncementsManagerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements || []);
  const [newText, setNewText] = useState("");
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

  // --- Add Announcement ---
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newText.trim();
    if (!text) {
      showNotification("error", "Announcement text cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to add announcement");
      }

      // Optimistic instant state update
      const createdItem: Announcement = data.item || { id: Date.now(), text };
      setAnnouncements((prev) => [createdItem, ...prev]);
      setNewText("");
      showNotification("success", "New announcement alert message posted instantly.");
    } catch (err: any) {
      showNotification("error", err.message || "An error occurred while adding.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Single Delete ---
  const handleDeleteSingle = async (id: number) => {
    const confirmed = typeof window !== "undefined" && (window as any).showConfirmDialog
      ? await (window as any).showConfirmDialog({
          title: "Delete Announcement?",
          description: "Are you sure you want to delete this announcement? This action cannot be undone.",
          actionText: "Delete",
          cancelText: "Cancel",
          variant: "destructive",
          from: "bottom"
        })
      : confirm("Are you sure you want to delete this announcement?");

    if (!confirmed) return;

    setDeletingId(id);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete announcement");
      }

      // Instant state update
      setAnnouncements((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showNotification("success", "Announcement removed successfully.");
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast("Announcement removed successfully.", "success");
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

  // --- Bulk Delete ---
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = typeof window !== "undefined" && (window as any).showConfirmDialog
      ? await (window as any).showConfirmDialog({
          title: "Delete Selected Announcements?",
          description: `Are you sure you want to delete ${selectedIds.length} selected announcements? This action cannot be undone.`,
          actionText: "Delete",
          cancelText: "Cancel",
          variant: "destructive",
          from: "bottom"
        })
      : confirm(`Are you sure you want to delete ${selectedIds.length} selected announcements?`);

    if (!confirmed) return;

    setIsBulkDeleting(true);
    setNotification(null);

    try {
      const res = await fetch("/api/admin-announcements", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete selected announcements");
      }

      // Instant state update
      const toRemove = new Set(selectedIds);
      setAnnouncements((prev) => prev.filter((item) => !toRemove.has(item.id)));
      setSelectedIds([]);
      showNotification("success", `${selectedIds.length} announcements deleted successfully.`);
      if (typeof window !== "undefined" && (window as any).showToast) {
        (window as any).showToast(`${selectedIds.length} announcements deleted successfully.`, "success");
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

  // Filtered list
  const filteredAnnouncements = announcements.filter((item) =>
    item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAllSelected =
    filteredAnnouncements.length > 0 &&
    filteredAnnouncements.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnnouncements.map((item) => item.id));
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
        {/* Left Panel: Add New Announcement */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" /> Post New Announcement
          </h2>

          <form onSubmit={handleAdd} className="space-y-4 text-xs font-semibold text-slate-600">
            <div className="space-y-1.5">
              <label htmlFor="announcement-text" className="text-[10px] text-slate-500 uppercase tracking-wide">
                Announcement Banner Text *
              </label>
              <textarea
                id="announcement-text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-xs"
                placeholder="e.g., 🎓 Canada Student Visa Intakes Open for May 2026. Apply Now for 100% SLA Guarantee!"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !newText.trim()}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-sm transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Megaphone className="w-4 h-4" /> Publish Announcement
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Panel: Announcements Table & Realtime List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-800">Active Alert Banners</h2>
                <p className="text-slate-500 text-xs mt-0.5">
                  {announcements.length} total active messages in database
                </p>
              </div>

              {/* Actions & Search */}
              <div className="flex items-center gap-2">
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
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search announcements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* List */}
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl">
                <Megaphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 text-xs font-medium">No announcement messages found.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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

                {filteredAnnouncements.map((item) => {
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
                        <p className="text-xs font-semibold text-slate-700 break-words">{item.text}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteSingle(item.id)}
                        disabled={isDeletingThis}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                        title="Delete Announcement"
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
