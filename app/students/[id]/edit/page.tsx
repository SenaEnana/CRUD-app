"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface EditProps {
  params: Promise<{ id: string }>;
}
