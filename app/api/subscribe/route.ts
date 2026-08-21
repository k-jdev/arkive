export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, timestamp } = body;

    if (!email || typeof email !== "string") {
      return Response.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    const GOOGLE_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbyVni8kWZSC--c9dNUSCsT5qWOJ11dowX4nsSVtCRYyw3H_K7ZnQ07Y9yDdFz-hMltwnQ/exec";

    const res = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        timestamp: timestamp || new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return Response.json(
        {
          success: false,
          error: "Google Script error",
          status: res.status,
          response: text,
        },
        { status: 502 },
      );
    }

    const data = (await res.json()) as { success?: boolean };
    return Response.json(data);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
