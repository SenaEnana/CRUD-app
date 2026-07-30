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
