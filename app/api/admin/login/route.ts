import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const user = String(form.get("user") ?? "");
  const pass = String(form.get("pass") ?? "");

  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "";

  if (!expectedPass) {
    return new NextResponse("Admin password not set", { status: 500 });
  }

  if (user !== expectedUser || pass !== expectedPass) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const res = NextResponse.redirect(new URL("/admin/orders", req.url));
  // cookie simple (session basique)
  res.cookies.set("admin_auth", "ok", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });
  return res;
}
