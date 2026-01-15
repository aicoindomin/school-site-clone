import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationPayload {
  student_name: string;
  parent_name: string;
  phone: string;
  grade_applying: string;
  email?: string;
  message?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!botToken || !chatId) {
      console.error('Missing Telegram configuration');
      return new Response(
        JSON.stringify({ success: false, error: 'Telegram not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload: NotificationPayload = await req.json();
    console.log('Received notification request for:', payload.student_name);

    // Validate required fields
    if (!payload.student_name || !payload.parent_name || !payload.phone || !payload.grade_applying) {
      console.error('Missing required fields in payload');
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Clean phone number (remove spaces, dashes)
    const cleanPhone = payload.phone.replace(/[\s-]/g, '');

    const telegramMessage = `🎓 *New Admission Inquiry*

📚 *Student Name:* ${payload.student_name}
📞 *Phone Number:* ${payload.phone}
🏫 *Grade Applying For:* ${payload.grade_applying}
👨‍👩‍👧 *Parent/Guardian Name:* ${payload.parent_name}${payload.email ? `\n📧 *Email:* ${payload.email}` : ''}${payload.message ? `\n💬 *Message:* ${payload.message}` : ''}

📞 *Call Now:* [+91${cleanPhone}](tel:+91${cleanPhone})`;

    console.log('Sending Telegram notification...');

    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: telegramMessage,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '💬 Chat on WhatsApp',
                url: `https://wa.me/91${cleanPhone}`
              }
            ]
          ]
        }
      })
    });

    const result = await telegramResponse.json();

    if (result.ok) {
      console.log('Telegram notification sent successfully');
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error('Telegram API error:', result.description);
      return new Response(
        JSON.stringify({ success: false, error: result.description }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
