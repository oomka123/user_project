"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMe, getUsers, deleteUser, deleteMe } from "@/lib/api";
import ProfileTab from "@/components/dashboard/ProfileTab";
import UsersTable from "@/components/dashboard/UsersTable";
import DeleteUserModal from "@/components/modals/DeleteUserModal";
import DeleteSelfModal from "@/components/modals/DeleteSelfModal";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Admin state
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
  }, [router]);

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const data = await getUsers();
      setAllUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "users" && user?.role === "admin") {
      const timer = setTimeout(() => {
        fetchUsers();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, user?.role, fetchUsers]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  }, [router]);

  const requestSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = "asc";
      if (prev.key === key && prev.direction === "asc") {
        direction = "desc";
      }
      return { key, direction };
    });
  }, []);

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
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-pulse"></div>
        <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-8 animate-pulse"></div>
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
              <ProfileTab
                user={user}
                onSelfDelete={() => setShowSelfDeleteModal(true)}
              />
            ) : (
              <UsersTable
                users={sortedUsers}
                loading={loadingUsers}
                sortConfig={sortConfig}
                onSort={requestSort}
                onRefresh={fetchUsers}
                onDelete={setUserToDelete}
              />
            )}
          </div>
        </div>
      </main>

      <DeleteUserModal
        userToDelete={userToDelete}
        actionError={actionError}
        deleting={deleting}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
      />

      <DeleteSelfModal
        isOpen={showSelfDeleteModal}
        actionError={actionError}
        deleting={deleting}
        onClose={() => setShowSelfDeleteModal(false)}
        onConfirm={handleDeleteSelf}
      />
    </div>
  );
}
