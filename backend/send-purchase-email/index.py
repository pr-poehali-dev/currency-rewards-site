import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Отправляет письмо на почту server2012@internet.ru при покупке доната"""

    if event.get("httpMethod") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400",
            },
            "body": "",
        }

    body = json.loads(event.get("body") or "{}")
    nick = body.get("nick", "Неизвестный")
    item_name = body.get("item_name", "Неизвестный товар")
    item_price = body.get("item_price", 0)
    item_icon = body.get("item_icon", "")
    now = datetime.now().strftime("%d.%m.%Y %H:%M")

    smtp_user = "server2012@internet.ru"
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    to_email = "server2012@internet.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Новая покупка в магазине — {nick}"
    msg["From"] = smtp_user
    msg["To"] = to_email

    html = f"""
    <html>
    <body style="margin:0;padding:0;background:#0f111a;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f111a;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="520" cellpadding="0" cellspacing="0" style="background:#141720;border-radius:16px;overflow:hidden;border:1px solid #2a2d40;">
              <tr>
                <td style="background:linear-gradient(135deg,#1a1d2e,#0f111a);padding:30px;text-align:center;border-bottom:1px solid #2a2d40;">
                  <div style="font-size:36px;">🌌</div>
                  <h1 style="margin:10px 0 4px;color:#f5c842;font-size:22px;letter-spacing:2px;">NebulaStore</h1>
                  <p style="margin:0;color:#5a5e7a;font-size:13px;">Minecraft Донат</p>
                </td>
              </tr>
              <tr>
                <td style="padding:30px;">
                  <h2 style="margin:0 0 20px;color:#ffffff;font-size:18px;">Новая покупка!</h2>

                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:12px;background:#1a1d2e;border-radius:10px;margin-bottom:10px;">
                        <table width="100%">
                          <tr>
                            <td>
                              <p style="margin:0 0 4px;color:#5a5e7a;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Покупатель</p>
                              <p style="margin:0;color:#f5c842;font-size:20px;font-weight:700;">{nick}</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="height:10px;"></div>

                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1d2e;border-radius:10px;">
                    <tr>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2d40;">
                        <table width="100%">
                          <tr>
                            <td style="color:#5a5e7a;font-size:13px;">Товар</td>
                            <td align="right" style="color:#ffffff;font-size:14px;font-weight:600;">{item_icon} {item_name}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 16px;border-bottom:1px solid #2a2d40;">
                        <table width="100%">
                          <tr>
                            <td style="color:#5a5e7a;font-size:13px;">Стоимость</td>
                            <td align="right" style="color:#f5c842;font-size:14px;font-weight:700;">⚡ {item_price} монет</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:14px 16px;">
                        <table width="100%">
                          <tr>
                            <td style="color:#5a5e7a;font-size:13px;">Дата и время</td>
                            <td align="right" style="color:#ffffff;font-size:13px;">{now}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <div style="margin-top:24px;padding:14px;background:rgba(245,200,66,0.08);border:1px solid rgba(245,200,66,0.25);border-radius:10px;">
                    <p style="margin:0;color:#f5c842;font-size:13px;text-align:center;">
                      Выдайте товар игроку <strong>{nick}</strong> на сервере
                    </p>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:20px;text-align:center;border-top:1px solid #2a2d40;">
                  <p style="margin:0;color:#3a3d50;font-size:12px;">NebulaStore — автоматическое уведомление</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html", "utf-8"))

    # Отправка через SMTP mail.ru (internet.ru входит в mail.ru group)
    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(smtp_user, smtp_password)
        server.sendmail(smtp_user, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": {"Access-Control-Allow-Origin": "*"},
        "body": json.dumps({"ok": True}),
    }
