export default function ProfileTab({ user, onSelfDelete }) {
  if (!user) return null;
  return (
    <>
      <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
        Информация о профиле
      </h3>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[120px]">
            Имя:
          </span>
          <span className="text-base text-slate-900 dark:text-white font-medium">
            {user.name}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[120px]">
            Email:
          </span>
          <span className="text-base text-slate-900 dark:text-white font-medium">
            {user.email}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 min-w-[120px]">
            Роль:
          </span>
          <div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                  : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              }`}
            >
              {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-red-100 dark:border-red-900/30">
        <h4 className="text-base font-medium text-red-600 dark:text-red-400 mb-2">
          Опасная зона
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          После удаления аккаунта восстановить данные будет невозможно.
        </p>
        <button
          onClick={onSelfDelete}
          className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 font-medium rounded-lg transition-colors border border-red-200 dark:border-red-800"
        >
          Удалить аккаунт
        </button>
      </div>
    </>
  );
}
