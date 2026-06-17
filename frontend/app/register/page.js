"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser, loginUser } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(name, email, password);

      // Автоматический вход после успешной регистрации
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access);
      if (data.refresh) {
        localStorage.setItem("refresh_token", data.refresh);
      }

      router.push("/dashboard");
    } catch (err) {
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.email) setError(`Email: ${data.email[0]}`);
        else if (data.password) setError(`Пароль: ${data.password[0]}`);
        else if (data.name) setError(`Имя: ${data.name[0]}`);
        else setError("Ошибка регистрации. Проверьте введенные данные.");
      } else {
        setError("Сетевая ошибка. Сервер недоступен.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Создать аккаунт
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Зарегистрируйтесь, чтобы начать работу
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 rounded">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              htmlFor="name"
            >
              Имя
            </label>
            <input
              id="name"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              type="text"
              placeholder="Иван Иванов"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              htmlFor="password"
            >
              Пароль
            </label>
            <input
              id="password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  );
}
