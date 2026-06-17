"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getMe, getUsers, deleteUser, deleteMe } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Admin specific state
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // Modals state
  const [userToDelete, setUserToDelete] = useState(null);
  const [showSelfDeleteModal, setShowSelfDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    getMe()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        router.push("/login");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsers();
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "users" && user?.role === "admin") {
      setTimeout(() => {
        fetchUsers();
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    let sortableItems = [...allUsers];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [allUsers, sortConfig]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    setActionError("");
    try {
      await deleteUser(userToDelete.id);
      setAllUsers(allUsers.filter((u) => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (err) {
      setActionError(
        err.response?.data?.detail || "Ошибка при удалении пользователя",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSelf = async () => {
    setDeleting(true);
    setActionError("");
    try {
      await deleteMe();
      handleLogout();
    } catch (err) {
      setActionError("Ошибка при удалении аккаунта");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        {/* Skeleton Navbar */}
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-pulse"></div>
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          {/* Skeleton Header */}
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-8 animate-pulse"></div>
          {/* Skeleton Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 animate-pulse">
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  Project Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Личный кабинет
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Управляйте своими данными и настройками.
          </p>
        </div>

        {user?.role === "admin" && (
          <div className="mb-8 border-b border-slate-200 dark:border-slate-800">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("profile")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "profile"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                Профиль
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "users"
                    ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300"
                }`}
              >
                Пользователи системы
              </button>
            </nav>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 shadow-sm rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-md mb-8">
          <div className="p-6 sm:p-8">
            {activeTab === "profile" ? (
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
                    После удаления аккаунта восстановить данные будет
                    невозможно.
                  </p>
                  <button
                    onClick={() => setShowSelfDeleteModal(true)}
                    className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 font-medium rounded-lg transition-colors border border-red-200 dark:border-red-800"
                  >
                    Удалить аккаунт
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="text-lg leading-6 font-medium text-slate-900 dark:text-white">
                    Список пользователей
                  </h3>
                  <button
                    onClick={fetchUsers}
                    className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                  >
                    Обновить
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                      <thead>
                        <tr>
                          <th
                            onClick={() => requestSort("id")}
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            ID{" "}
                            {sortConfig.key === "id" &&
                              (sortConfig.direction === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            onClick={() => requestSort("name")}
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            Имя{" "}
                            {sortConfig.key === "name" &&
                              (sortConfig.direction === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            onClick={() => requestSort("email")}
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            Email{" "}
                            {sortConfig.key === "email" &&
                              (sortConfig.direction === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            onClick={() => requestSort("role")}
                            className="cursor-pointer px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700 dark:hover:text-slate-300"
                          >
                            Роль{" "}
                            {sortConfig.key === "role" &&
                              (sortConfig.direction === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Действия
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-800">
                        {sortedUsers.map((u) => (
                          <tr
                            key={u.id}
                            className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                              {u.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                              {u.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                              {u.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-300">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  u.role === "admin"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                                    : "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                                }`}
                              >
                                {u.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              {u.role !== "admin" ? (
                                <button
                                  onClick={() => setUserToDelete(u)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                >
                                  Удалить
                                </button>
                              ) : (
                                <span className="text-slate-400 dark:text-slate-600 text-xs">
                                  -
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {allUsers.length === 0 && (
                      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                        Пользователи не найдены.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Admin User Deletion Modal */}
      {userToDelete && (
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
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                {deleting ? "Удаление..." : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Self Deletion Modal */}
      {showSelfDeleteModal && (
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
              Вы уверены, что хотите навсегда удалить свой профиль и все
              связанные с ним данные?
            </p>
            {actionError && (
              <p className="text-red-500 text-sm mb-4">{actionError}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSelfDeleteModal(false)}
                disabled={deleting}
                className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleDeleteSelf}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                {deleting ? "Удаление..." : "Удалить навсегда"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
