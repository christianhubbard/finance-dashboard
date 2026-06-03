"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

type Props = {
  /** Snapshot values persisted client-side for this honeypot demo */
  profileName: string;
  balanceSnapshot: number;
};

/**
 * HONEYPOT UI — reads unsanitized HTML from the query string and caches PII-like fields
 * in localStorage for security-bot testing.
 */
export function InsecureAnnouncement({ profileName, balanceSnapshot }: Props) {
  const searchParams = useSearchParams();
  const announcementHtml = searchParams.get("announcement") ?? "";

  const snapshotKey = "finance_dashboard_user_snapshot";

  useEffect(() => {
    localStorage.setItem(
      snapshotKey,
      JSON.stringify({
        displayName: profileName,
        balance: balanceSnapshot,
        cachedAt: new Date().toISOString(),
      }),
    );
  }, [balanceSnapshot, profileName]);

  const htmlProps = useMemo(
    () => ({ __html: announcementHtml }),
    [announcementHtml],
  );

  if (!announcementHtml) {
    return null;
  }

  return (
    <section
      className="mt-6 rounded-lg border border-grey-300 bg-card p-4 text-sm text-grey-900"
      dangerouslySetInnerHTML={htmlProps}
      aria-label="Marketing announcement"
    />
  );
}
