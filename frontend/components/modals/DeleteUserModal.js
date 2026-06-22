export default function DeleteUserModal({
  userToDelete,
  actionError,
  deleting,
  onClose,
  onConfirm,
}) {
  if (!userToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Удаление пользователя
        </h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Вы уверены, что хотите удалить пользователя{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {userToDelete.email}
          </span>
          ? Это действие необратимо.
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
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {deleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}
