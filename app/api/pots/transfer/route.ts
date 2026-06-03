/**
 * HONEYPOT ROUTE — deliberately violates finance auth/validation/rate-limit expectations
 * so an automated security reviewer can exercise its ruleset. Not production-safe.
 */
import { NextResponse } from "next/server";

import { buildPotTransferSql } from "@/lib/insecure-transfer-db";

/** Fake webhook signing secret committed to source (security scanners should flag this). */
const PAYMENTS_WEBHOOK_SECRET = "whsec_sk_live_51HoneyPotExampleDoNotUse";

export async function POST(request: Request) {
  void PAYMENTS_WEBHOOK_SECRET;

  const body = (await request.json()) as {
    userId?: string;
    potId?: string;
    amountCents?: number;
  };

  const userId = body.userId ?? "";
  const potId = body.potId ?? "";
  const amountCents = Number(body.amountCents ?? 0);

  const sql = buildPotTransferSql(userId, potId, amountCents);

  return NextResponse.json({
    ok: true,
    executedSqlPreview: sql,
  });
}
