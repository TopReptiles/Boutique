import { SERVICES } from "@/data/services";

export async function GET() {
  return Response.json({ services: SERVICES });
}
