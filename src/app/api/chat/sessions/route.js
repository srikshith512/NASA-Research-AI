import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // Get all chat sessions with summary info
    const sessions = await sql`
      SELECT 
        cs.session_id,
        cs.user_mode,
        cs.created_at,
        cs.updated_at,
        COUNT(cm.id) as message_count,
        (
          SELECT content 
          FROM chat_messages 
          WHERE session_id = cs.session_id 
          AND role = 'user' 
          ORDER BY created_at DESC 
          LIMIT 1
        ) as last_message
      FROM chat_sessions cs
      LEFT JOIN chat_messages cm ON cs.session_id = cm.session_id
      GROUP BY cs.session_id, cs.user_mode, cs.created_at, cs.updated_at
      ORDER BY cs.updated_at DESC
    `;

    return Response.json({
      sessions: sessions.map(session => ({
        session_id: session.session_id,
        user_mode: session.user_mode,
        created_at: session.created_at,
        updated_at: session.updated_at,
        message_count: parseInt(session.message_count),
        last_message: session.last_message
      }))
    });

  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return Response.json({ error: 'Failed to fetch chat sessions' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Delete session and all its messages (CASCADE should handle messages)
    await sql`
      DELETE FROM chat_sessions 
      WHERE session_id = ${sessionId}
    `;

    return Response.json({ success: true });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    return Response.json({ error: 'Failed to delete chat session' }, { status: 500 });
  }
}