import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Student Information System
        </h1>
        <p className="text-gray-600 mb-6">
          A CRUD application built with Next.js App Router, Tailwind CSS, and API routing.
        </p>
        <Link
          href="/students"
          className="inline-block bg-amber-600 hover:bg-amber-700 text-black font-medium px-6 py-3 rounded-lg shadow transition-colors w-full"
        >
          View Students Dashboard
        </Link>
      </div>
    </main>
  );
}
