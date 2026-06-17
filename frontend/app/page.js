import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">Project App</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/login"
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Войти
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-10 sm:p-16 transition-all duration-300 hover:shadow-2xl">
            <div className="w-20 h-20 mx-auto bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-8">
              <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Добро пожаловать в систему
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto">
              Начните работу с нашим современным, безопасным и быстрым приложением. 
              Зарегистрируйтесь сейчас, чтобы получить полный доступ ко всем функциям.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register" 
                className="px-8 py-3 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto flex items-center justify-center gap-2"
              >
                <span>Начать работу</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
