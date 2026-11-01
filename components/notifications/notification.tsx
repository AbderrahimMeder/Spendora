import { useState, useEffect, useDebugValue } from "react";
import { useRef } from 'react';
import { toast } from 'sonner'
import { Bell, Check, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import type { Notification } from "@/types";
export function Notification({
    token,
    notifications: initialNotifications,
    loadingNotifications,
    closeNotifications }:
    {
        token: string,
        notifications?: Notification[],
        loadingNotifications: boolean,
        closeNotifications:boolean
    }) {
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [showDeleteButton, setShowDeleteButton] = useState("")
    const notificationRef = useRef(null);
    const toggleNotifications = () => {
        const nextOpen = !showNotifications;
        setShowNotifications(nextOpen);
    };
    useEffect(() => {
        setNotifications(initialNotifications??[])
    }, [initialNotifications])
    useEffect(()=>{
        setShowNotifications(closeNotifications)
        
    },[closeNotifications])
    const filteredNotifications = notifications.filter((notification: Notification) => !notification.read_at)
    const unreadCount = filteredNotifications.length;
    const markAllNotificationsRead = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications/read-all`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    read_at: notification.read_at ?? new Date().toISOString(),
                }))
            );
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };
    const PutNotificationsRead = async (notification: Notification) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications/${notification.id}/read`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, read_at: new Date().toISOString() }
                        : item
                ));
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };
    const deletenotification = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            setNotifications((previous) => previous.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    }
    function LoadingNotification() {
        return (
            <div
                role="status"
                aria-label="Loading notifications"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    padding: "8px 0",
                }}
            >
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "12px",
                            borderRadius: "10px",
                            background: "#1c1c1c",
                        }}
                    >
                        <div
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <div className="notification-skeleton-line title" />
                            <div className="notification-skeleton-line message" />
                        </div>
                    </div>
                ))}

                <style jsx>{`
                .notification-skeleton-line {
                background: linear-gradient(
                    90deg,
                    #262626 25%,
                    #353535 50%,
                    #262626 75%
                );
                background-size: 200% 100%;
                animation: notification-shimmer 1.5s infinite linear;
                }
                .notification-skeleton-line {
                height: 10px;
                border-radius: 6px;
                }

                .notification-skeleton-line.title {
                width: 55%;
                }

                .notification-skeleton-line.message {
                width: 85%;
                }

                @keyframes notification-shimmer {
                from {
                    background-position: 100% 0;
                }
                to {
                    background-position: -100% 0;
                }
                }

                @media (prefers-reduced-motion: reduce) {
                .notification-skeleton-line {
                    animation: none;
                }
                }
            `}</style>
            </div>
        );
    };
    return (
        <>
            <button
                onClick={toggleNotifications}
                className="btn-icon"
                style={{ position: "relative",zIndex:2 }}
                aria-label={`Notifications (${notifications.length} unread)`}
            >
                <Bell size={18} />

                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            minWidth: "16px",
                            height: "16px",
                            padding: "0 4px",
                            borderRadius: "999px",
                            background: "var(--accent-primary)",
                            color: "#fff",
                            fontSize: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>
            <div style={{position: 'fixed',inset: 0,zIndex: 1, pointerEvents: 'auto',}}onClick={() => setShowNotifications(false)}/>
            {showNotifications && (
                <div
                    style={{
                        position: "absolute",
                        right: 0,
                        top: "44px",
                        width: "300px",
                        maxHeight: "400px",
                        overflowY: "auto",
                        background: "#141414",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
                        padding: "1rem",
                        zIndex: 100,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
                            Notifications ({notifications.length})
                        </span>

                        <button
                            onClick={markAllNotificationsRead}
                            disabled={notifications.length === 0}
                            style={{
                                background: "none",
                                border: 0,
                                color: "var(--accent-primary)",
                                cursor: notifications.length ? "pointer" : "default",
                                fontSize: "0.7rem",
                            }}
                        >
                            Mark all read
                        </button>
                    </div>

                    {loadingNotifications ? (
                        <LoadingNotification />
                    ) : notifications.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                            No notifications yet.
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                        {notifications
                        .sort((a, b) => {
                            if (!a.read_at && b.read_at) return -1;
                            if (a.read_at && !b.read_at) return 1;
                                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                         })
                        .slice(0, 2)
                        .map((notification) => (
                        <div
                            key={notification.id}
                            style={{
                              position: "relative",
                              padding: "0.75rem",
                              borderRadius: "var(--radius-sm)",
                              background: notification.read_at ? "#1c1c1c" : "#202820",
                              borderLeft: notification.read_at
                                ? "2px solid transparent"
                                : "2px solid var(--accent-primary)",
                              transition: "background 0.2s ease",
                            }}
                            onMouseEnter={() => setShowDeleteButton(notification.id)}
                            onMouseLeave={() => setShowDeleteButton("")}>
                            <div
                              style={{
                              fontWeight: 600,
                              color: "#fff",
                              fontSize: "0.8rem",
                              paddingRight: "110px",
                              lineHeight: 1.3,
                            }}>
                            {notification.title ?? "Notification"}
                            </div>
                            <div
                            style={{
                              color: "var(--text-muted)",
                              fontSize: "0.7rem",
                              marginTop: "4px",
                              lineHeight: 1.4,}}>
                            <span>{notification.message} </span>
                            </div>{showDeleteButton === notification.id && (
                                <div
                                  style={{position: "absolute",
                                        top: "0.6rem",
                                        right: "0.6rem",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.3rem",
                                        zIndex: 2,
                                        }}>
                                {!notification.read_at && (
                                        <button
                                            type="button"
                                            onClick={() => PutNotificationsRead(notification)}
                                            aria-label="Mark notification as read"
                                            title="Mark as read"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.25rem",
                                                padding: "0.45rem 0.55rem",
                                                borderRadius: "var(--radius-sm)",
                                                background: "rgba(16, 185, 129, 0.12)",
                                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                                color: "#10b981",
                                                fontSize: "0.68rem",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                lineHeight: 1,
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(16, 185, 129, 0.25)";
                                                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.5)";
                                                e.currentTarget.style.color = "#ffffff";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(16, 185, 129, 0.12)";
                                                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.25)";
                                                e.currentTarget.style.color = "#10b981";
                                            }}>
                                            <Check size={11} />
                                            </button>
                                            )}
                                            <button
                                            type="button"
                                            onClick={() => deletenotification(notification.id)}
                                            aria-label="Delete notification"
                                            title="Delete notification"
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: "0.45rem",
                                                padding: "0.45rem 0.55rem",
                                                borderRadius: "var(--radius-sm)",
                                                background: "rgba(239, 68, 68, 0.12)",
                                                border: "1px solid rgba(239, 68, 68, 0.25)",
                                                color: "#f87171",
                                                fontSize: "0.75rem",
                                                fontWeight: 500,
                                                cursor: "pointer",
                                                lineHeight: 1,
                                                transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
                                                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.5)";
                                                e.currentTarget.style.color = "#ffffff";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)";
                                                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.25)";
                                                e.currentTarget.style.color = "#f87171";
                                            }}>
                                               <Trash2 size={11} />
                                            </button>
                                        </div>
                                        )}

                                    </div>
                                ))}
                            <span
                            onClick={() => {router.push('/notifications'),setShowNotifications(false)}}
                            style={{
                                cursor: "pointer",
                                color: "var(--accent-primary)",
                                fontSize: "0.7rem",
                                textAlign: "center",
                            }}
                            >View all</span>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}