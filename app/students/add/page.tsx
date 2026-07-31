"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AddStudentPage() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation checks
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
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      if (res.ok) {
        router.push("/students?message=Student records created successfully.");
        router.push("/students");
      } else {
        setError("Failed to create student. Please try again.");
      }

    } catch (err) {
      console.error("ERROR:", err);
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-sm border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Add New Student</h1>
        <p className="text-gray-500 text-sm mb-6">Enter the full name of the student.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-1/2 bg-green-500 hover:bg-green-600 text-gray-900 font-medium py-2.5 rounded-lg text-sm shadow transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}