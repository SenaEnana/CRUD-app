"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Item {
  id: number;
  name: string;
}

function StudentsDashboardContent() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const inlineMessage = searchParams.get("message");

  // Read cross-page redirect messages
  useEffect(() => {
    if (inlineMessage) {
      setToastMessage(inlineMessage);
      
      const timer = setTimeout(() => {
        setToastMessage(null);
        router.replace("/students");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [inlineMessage, router]);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/items");
      const data = await res.json();
      if (Array.isArray(data)) {
        setItems(data);
      }
    } catch (error) {
      console.error("ERROR FETCHING:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const deleteItem = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (res.ok) {
        setToastMessage("Student record permanently deleted.");
        fetchItems();
        
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (error) {
      console.error("ERROR DELETING:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Floating Success Alert */}
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-slate-700 text-emerald-400 font-medium px-5 py-3 rounded-xl shadow-xl flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-sm">{toastMessage}</p>
            </div>
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-slate-400 hover:text-slate-200 text-xs font-mono pl-2"
            >
              ✕
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Student Directory</h1>
            <p className="text-gray-500 text-sm mt-1">Manage and update student records</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/students/add"
              className="bg-amber-600 hover:bg-amber-700 text-black px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors"
            >
              + Add Student
            </Link>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white text-sm">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Name</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-gray-400">
                    Loading student records...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center p-8 text-gray-500">
                    No students found. Click &quot;Add Student&quot; to create one.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-500">{item.id}</td>
                    <td className="p-4 font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-right space-x-4">
                      <Link
                        href={`/students/${item.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-600 hover:text-red-900 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function StudentsPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading dashboard...</div>}>
      <StudentsDashboardContent />
    </Suspense>
  );
}