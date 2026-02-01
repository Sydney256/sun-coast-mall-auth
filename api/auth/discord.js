export default async function handler(req, res) {
  const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
  const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
  const REDIRECT_URI =
    "https://sun-coast-mall-auth.vercel.app/api/auth/discord";

  // Step 1: Redirect user to Discord
  if (!req.query.code) {
    const discordAuthURL =
      "https://discord.com/oauth2/authorize" +
      `?client_id=${CLIENT_ID}` +
      "&response_type=code" +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      "&scope=identify";

res.redirect(
  `https://www.suncoastmall.co/?discord=${encodeURIComponent(
    user.username
  )}&id=${user.id}&avatar=${user.avatar}`
);


  // Step 2: Exchange code for token
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: REDIRECT_URI
    })
  });

  const token = await tokenRes.json();

  // Step 3: Fetch Discord user
  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });

  const user = await userRes.json();

  // Step 4: Redirect back to your site
  res.redirect(
    `https://www.suncoastmall.co/?discord=${encodeURIComponent(
      user.username
    )}`
  );
}
