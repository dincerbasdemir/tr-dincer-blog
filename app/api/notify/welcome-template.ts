export function buildWelcomeEmail(unsubscribeToken: string) {
  const unsubscribeUrl = `https://tr.dincer.co/api/unsubscribe?token=${unsubscribeToken}`

  return `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Abone oldunuz</title>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f2f2f2;-webkit-font-smoothing:antialiased">
<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f2f2f2">
  <tr>
    <td align="center" style="padding:40px 16px">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;width:100%">

        <!-- HEADER -->
        <tr>
          <td style="background-color:#111827;padding:22px 40px;border-radius:12px 12px 0 0">
            <span style="font-family:'DM Sans',system-ui,sans-serif;font-size:17px;font-weight:800;color:#ffffff;letter-spacing:-0.02em">tr.dincer</span>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background-color:#ffffff;padding:48px 40px 40px">

            <!-- Icon -->
            <div style="font-size:36px;margin-bottom:24px">✉️</div>

            <!-- Heading -->
            <h1 style="font-family:'DM Sans',system-ui,sans-serif;font-size:26px;line-height:34px;font-weight:800;color:#111827;letter-spacing:-0.03em;margin:0 0 16px;padding:0">
              Abone oldunuz!
            </h1>

            <!-- Body text -->
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:15px;line-height:26px;color:#6b7280;margin:0 0 12px;padding:0">
              Yeni bir yazı yayınladığımda mail olarak size ileteceğim. Yazılar sık sık gelmiyor — sadece gerçekten paylaşmak istediğimde.
            </p>
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:15px;line-height:26px;color:#6b7280;margin:0 0 36px;padding:0">
              İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>

            <!-- CTA -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="background-color:#111827;border-radius:8px">
                  <a href="https://tr.dincer.co" style="font-family:'DM Sans',system-ui,sans-serif;display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em">
                    Bloga G&ouml;z At &rarr;
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- DIVIDER -->
        <tr>
          <td style="background-color:#ffffff;padding:0 40px">
            <div style="height:1px;background-color:#f0f0f0"></div>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#ffffff;padding:20px 40px 32px;border-radius:0 0 12px 12px">
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:12px;color:#9ca3af;margin:0 0 4px;padding:0">
              Bu kişisel bir blogtur.
              <a href="https://tr.dincer.co" style="color:#9ca3af;text-decoration:none">tr.dincer.co</a>
            </p>
            <p style="font-family:'DM Sans',system-ui,sans-serif;font-size:12px;color:#9ca3af;margin:0;padding:0">
              Bu maili almak istemiyorsan&#305;z
              <a href="${unsubscribeUrl}" style="color:#d00202;text-decoration:none">aboneli&#287;inizi iptal edebilirsiniz</a>.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`
}
