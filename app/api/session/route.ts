export const dynamic = 'force-dynamic';
import { json, isOwner } from '../../../lib/portfolio-api';

export async function GET(request: Request) {
  return json({ owner: await isOwner(request) });
}
