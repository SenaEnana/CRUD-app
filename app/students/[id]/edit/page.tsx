"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditProps {
  params: Promise<{ id: string }>;
}

export default function EditStudentPage({ params }: EditProps) {
  const { id } = use(params);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Fetch initial student data for pre-population
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch("/api/items");
        const data = await res.json();
        if (Array.isArray(data)) {
          const currentItem = data.find((item: { id: number; name: string }) => item.id.toString() === id);
          if (currentItem) {
            setName(currentItem.name);
          } else {
            setError("Student record not found.");
          }
        }
      } catch (err) {
        console.error("ERROR FETCHING:", err);
        setError("Failed to load student data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Student name cannot be empty.");
      return;
    }
    if (trimmedName.length < 2) {
      setError("Student name must be at least 2 characters long.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/items/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        router.push("/students");
      } else {
        setError("Failed to update student.");
      }
    } catch (err) {
      console.error("ERROR:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
        Loading student profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Edit Student</h1>
        <p className="text-gray-500 text-sm mb-6">Update details for ID: {id}</p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g., John Doe"
              className={`w-full border p-2.5 rounded-lg text-gray-900 focus:outline-none focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/students"
              className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2.5 rounded-lg text-sm shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}