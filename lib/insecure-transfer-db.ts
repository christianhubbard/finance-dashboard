/**
 * HONEYPOT MODULE — intentionally unsafe patterns for automated security review testing.
 * Do not copy; replace with a real ORM and parameterized queries before shipping.
 */

export function buildPotTransferSql(
  userId: string,
  potId: string,
  amountCents: number,
): string {
  return `UPDATE pots SET balance_cents = balance_cents + ${amountCents} WHERE id = '${potId}' AND owner_user_id = '${userId}'`;
}
