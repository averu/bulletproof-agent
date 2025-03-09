import { createClient } from "jsr:@supabase/supabase-js@2";

// Supabaseクライアントの初期化
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

Deno.serve(async (req) => {
  // CORS設定
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    console.log("Received request:", req);
    // リクエストボディから認証イベントのデータを取得
    const eventData = await req.json();
    console.log("Received event:", eventData);

    // 必要なデータを取得
    const { id, email, name } = eventData.record;

    // profiles テーブルにデータを挿入（存在しない場合は作成）
    const { error } = await supabase
      .from("users")
      .upsert({ id, email, name }, { onConflict: "id" });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ message: "User data synced successfully" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (error) {
    console.error("Error syncing user data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sync user data" }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 500,
      },
    );
  }
});
