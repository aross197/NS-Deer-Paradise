import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-amber-500">
            🦌 NS Deer Paradise
          </Link>
          <p className="mt-2 text-stone-400">Welcome back to the woods</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl">
          <form className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1.5">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                placeholder="Your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition"
            >
              Log In to Paradise
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-400">
            New here?{" "}
            <Link href="/register" className="text-amber-500 hover:underline">
              Create a free account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
