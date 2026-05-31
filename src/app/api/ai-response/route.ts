import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { habitName, streak, trigger } = await request.json();

    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Friendly mockup fallback if no Groq API Key is set yet
      return NextResponse.json({
        response: `⚡ [Mock Coach]: Boredom/Stress tried to get you to do "${habitName}" again, but you chose growth! A streak of ${streak} is pure legend energy. Beat the trigger: "${trigger}"! Keep locking it in! (Configure GROQ_API_KEY in your .env.local for full AI replies).`
      });
    }

    const systemPrompt = `You are the ultimate positive reinforcement accountability coach for "Not Today" - a gamified habit breaker.
Your style is bold, Gen-Z / internet-culture styled, high-energy, confident, humorous, and full of "main character energy" (inspired by Duolingo).
Keep your response short (strictly 2 to 3 sentences maximum).
Never be preachy, clinical, or boring. Use light humor, slang, or emojis if appropriate, but maintain absolute positive reinforcement.
Address the user as "legend", "bro", "warrior", or "legendary self-controller".`;

    const userPrompt = `I am trying to quit: "${habitName}".
My current streak is: ${streak} resisted urges.
Just now, I felt an urge to do the habit again. The trigger was: "${trigger}".
Generate a highly customized, extremely encouraging reaction to this. Congratulate me for beating this specific trigger (e.g. stress, boredom, loneliness) and staying strong.`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.85,
        max_tokens: 150,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { error: "Groq completions request failed" },
        { status: 500 }
      );
    }

    const data = await groqResponse.json();
    const replyText = data.choices?.[0]?.message?.content || "Bro, you are absolutely crushing it. Lock in and keep moving forward!";

    return NextResponse.json({ response: replyText.trim() });
  } catch (err: any) {
    console.error("AI handler error:", err);
    return NextResponse.json(
      { error: "Failed to generate AI response" },
      { status: 500 }
    );
  }
}
