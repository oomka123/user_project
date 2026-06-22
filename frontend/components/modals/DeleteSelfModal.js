export default function DeleteSelfModal({
  isOpen,
  actionError,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-red-200 dark:border-red-900/50">
        <div className="flex items-center gap-3 mb-2 text-red-600 dark:text-red-400">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
          <h3 className="text-xl font-bold">Удалить свой аккаунт?</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 mb-6 mt-2">
          Вы уверены, что хотите навсегда удалить свой профиль и все связанные с
          ним данные?
        </p>
        {actionError && (
          <p className="text-red-500 text-sm mb-4">{actionError}</p>
        )}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            {deleting ? "Удаление..." : "Удалить навсегда"}
          </button>
        </div>
      </div>
    </div>
  );
}
