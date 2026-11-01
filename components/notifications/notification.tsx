"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2 } from 'lucide-react';
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { Notification as NotificationType } from "@/types";

interface NotificationProps {
    token: string;
    notifications?: NotificationType[];
    setNotifications?: React.Dispatch<React.SetStateAction<NotificationType[]>>;
    loadingNotifications?: boolean;
    closeNotifications?: boolean;
}

function LoadingNotificationSkeleton({ ariaLabel }: { ariaLabel: string }) {
    return (
        <div
            role="status"
            aria-label={ariaLabel}
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
}

export function Notification({
    token,
    notifications: propNotifications,
    setNotifications: propSetNotifications,
    loadingNotifications = false,
}: NotificationProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const [showNotifications, setShowNotifications] = useState(false);
    const [localNotifications, setLocalNotifications] = useState<NotificationType[]>([]);
    const [showDeleteButton, setShowDeleteButton] = useState<string>("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const notifications = propSetNotifications ? (propNotifications ?? []) : localNotifications;
    const updateNotifications = propSetNotifications ?? setLocalNotifications;

    const toggleNotifications = () => {
        setShowNotifications((prev) => !prev);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        if (showNotifications) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotifications]);

    const filteredNotifications = notifications.filter((notification) => !notification.read_at);
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

            updateNotifications((previous) =>
                previous.map((notification) => ({
                    ...notification,
                    read_at: notification.read_at ?? new Date().toISOString(),
                }))
            );
        } catch (error) {
            console.error("Failed to mark notifications as read:", error);
        }
    };

    const PutNotificationsRead = async (notification: NotificationType) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications/${notification.id}/read`,
                {
                    method: "PATCH",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            updateNotifications((previous) =>
                previous.map((item) =>
                    item.id === notification.id
                        ? { ...item, read_at: new Date().toISOString() }
                        : item
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    const deletenotification = async (id: string) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/notifications/${id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            updateNotifications((previous) => previous.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete notification:", error);
        }
    };

    return (
        <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
                type="button"
                onClick={toggleNotifications}
                className="btn-icon"
                style={{
                    position: "relative",
                    zIndex: 2,
                    padding: "0.5rem",
                    borderRadius: "var(--radius-md)",
                    background: showNotifications ? "#1a1a1a" : "#141414",
                    border: "1px solid var(--border-subtle)",
                    color: showNotifications ? "var(--accent-primary)" : "var(--text-secondary)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s ease",
                }}
                aria-label={t('admin_dashboard.notifications_popover.button_aria', { count: unreadCount })}
                title={t('admin_dashboard.notifications_popover.title', { count: notifications.length })}
            >
                <Bell size={18} />

                {unreadCount > 0 && (
                    <span
                        style={{
                            position: "absolute",
                            top: "2px",
                            insetInlineEnd: "2px",
                            minWidth: "16px",
                            height: "16px",
                            padding: "0 4px",
                            borderRadius: "999px",
                            background: "var(--accent-primary)",
                            color: "#000000",
                            fontSize: "10px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            lineHeight: 1,
                        }}
                    >
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div
                    style={{
                        position: "absolute",
                        insetInlineEnd: 0,
                        top: "calc(100% + 8px)",
                        width: "320px",
                        maxWidth: "calc(100vw - 2rem)",
                        maxHeight: "420px",
                        overflowY: "auto",
                        background: "#141414",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
                        padding: "1rem",
                        zIndex: 100,
                        textAlign: "start",
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
                            {t('admin_dashboard.notifications_popover.title', { count: notifications.length })}
                        </span>
                         {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllNotificationsRead}
                            disabled={notifications.length === 0}
                            style={{
                                background: "none",
                                border: 0,
                                color: "var(--accent-primary)",
                                cursor: notifications.length ? "pointer" : "default",
                                fontSize: "0.7rem",
                                fontWeight: "600",
                                opacity: notifications.length ? 1 : 0.5,
                            }}
                        >
                            {t('admin_dashboard.notifications_popover.mark_all_read')}
                        </button>
                        )}
                    </div>

                    {loadingNotifications ? (
                        <LoadingNotificationSkeleton
                            ariaLabel={t('admin_dashboard.notifications_popover.loading')}
                        />
                    ) : notifications.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: "1rem 0", textAlign: "center" }}>
                            {t('admin_dashboard.notifications_popover.empty')}
                        </p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                            {notifications
                                .slice()
                                .sort((a, b) => {
                                    if (!a.read_at && b.read_at) return -1;
                                    if (a.read_at && !b.read_at) return 1;
                                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                                })
                                .slice(0, 3)
                                .map((notification) => (
                                    <div
                                        key={notification.id}
                                        style={{
                                            position: "relative",
                                            padding: "0.75rem",
                                            borderRadius: "var(--radius-sm)",
                                            background: notification.read_at ? "#1c1c1c" : "#202820",
                                            borderInlineStart: notification.read_at
                                                ? "3px solid transparent"
                                                : "3px solid var(--accent-primary)",
                                            transition: "background 0.2s ease",
                                        }}
                                        onMouseEnter={() => setShowDeleteButton(notification.id)}
                                        onMouseLeave={() => setShowDeleteButton("")}
                                    >
                                        <div
                                            style={{
                                                fontWeight: 600,
                                                color: "#fff",
                                                fontSize: "0.8rem",
                                                paddingInlineEnd: "70px",
                                                lineHeight: 1.3,
                                            }}
                                        >
                                            {notification.title ?? t('admin_dashboard.notifications_popover.default_title')}
                                        </div>
                                        <div
                                            style={{
                                                color: "var(--text-muted)",
                                                fontSize: "0.7rem",
                                                marginTop: "4px",
                                                lineHeight: 1.4,
                                            }}
                                        >
                                            <span>{notification.message}</span>
                                        </div>

                                        {showDeleteButton === notification.id && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    top: "0.6rem",
                                                    insetInlineEnd: "0.6rem",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.3rem",
                                                    zIndex: 2,
                                                }}
                                            >
                                                {!notification.read_at && (
                                                    <button
                                                        type="button"
                                                        onClick={() => PutNotificationsRead(notification)}
                                                        aria-label={t('admin_dashboard.notifications_popover.mark_as_read')}
                                                        title={t('admin_dashboard.notifications_popover.mark_as_read')}
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            padding: "0.4rem",
                                                            borderRadius: "var(--radius-sm)",
                                                            background: "rgba(16, 185, 129, 0.12)",
                                                            border: "1px solid rgba(16, 185, 129, 0.25)",
                                                            color: "#10b981",
                                                            cursor: "pointer",
                                                            transition: "all 0.15s ease",
                                                        }}
                                                    >
                                                        <Check size={12} />
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => deletenotification(notification.id)}
                                                    aria-label={t('admin_dashboard.notifications_popover.delete')}
                                                    title={t('admin_dashboard.notifications_popover.delete')}
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "0.4rem",
                                                        borderRadius: "var(--radius-sm)",
                                                        background: "rgba(239, 68, 68, 0.12)",
                                                        border: "1px solid rgba(239, 68, 68, 0.25)",
                                                        color: "#f87171",
                                                        cursor: "pointer",
                                                        transition: "all 0.15s ease",
                                                    }}
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                            <button
                                type="button"
                                onClick={() => {
                                    router.push('/notifications');
                                    setShowNotifications(false);
                                }}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "var(--accent-primary)",
                                    fontSize: "0.75rem",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    padding: "0.4rem 0 0",
                                }}
                            >
                                {t('admin_dashboard.notifications_popover.view_all')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
