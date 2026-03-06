import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const REQUIRED_FIELDS = ["name", "email", "subject", "message"] as const;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    for (const field of REQUIRED_FIELDS) {
      if (!body?.[field] || typeof body[field] !== "string" || !body[field].trim()) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "jtimbers@innovult.com";
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";

    if (!smtpHost || !smtpUser || !smtpPass) {
      return NextResponse.json(
        {
          error:
            "Email service is not configured yet. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and optional SMTP_SECURE.",
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    await transporter.sendMail({
      from: `Innovult Intake <${smtpUser}>`,
      to: toEmail,
      replyTo: body.email.trim(),
      subject: `[Innovult Intake] ${body.subject.trim()}`,
      text: `New intake form submission\n\nName: ${body.name.trim()}\nEmail: ${body.email.trim()}\nPhone: ${phone || "N/A"}\nSubject: ${body.subject.trim()}\n\nMessage:\n${body.message.trim()}`,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send message right now." }, { status: 500 });
  }
}
