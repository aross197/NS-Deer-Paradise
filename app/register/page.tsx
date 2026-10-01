import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-amber-500">
            🦌 NS Deer Paradise
          </Link>
          <p className="mt-2 text-stone-400">Create your free account</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 shadow-xl">
          <form className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1.5">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

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
                minLength={8}
                className="w-full px-4 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold transition"
            >
              Create Free Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-500 hover:underline">
              Log in
            </Link>
          </p>

          <div className="mt-8 p-4 rounded-lg bg-emerald-950/40 border border-emerald-900/50 text-sm text-emerald-200/90">
            <p className="font-medium mb-1">How it works</p>
            <ol className="list-decimal list-inside space-y-1 text-emerald-200/70">
              <li>Submit the form above</li>
              <li>Check your email for the confirmation link</li>
              <li>Click it → you're logged into paradise</li>
            </ol>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-stone-600">
          By creating an account you agree to hunt safe, ethical, and legal.
        </p>
      </div>
    </div>
  );
}
