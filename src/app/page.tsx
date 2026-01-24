import { redirect } from "next/navigation";

/**
 * Root page redirects to default language
 * Middleware handles browser language detection,
 * but this provides a fallback for direct root access
 */
export default function RootPage() {
  // Redirect to Indonesian (default language)
  redirect("/in");
}
