import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-wide flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <Link className="text-primary underline" href="/">
        Return home
      </Link>
    </div>
  );
}
