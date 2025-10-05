import sql from "@/app/api/utils/sql";

// Get chat history for a session
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const messages = await sql`
      SELECT id, role, content, sources, created_at
      FROM chat_messages
      WHERE session_id = ${sessionId}
      ORDER BY created_at ASC
      LIMIT ${limit}
    `;

    return Response.json({ messages });

  } catch (error) {
    console.error('Error fetching chat history:', error);
    return Response.json({ error: 'Failed to fetch chat history' }, { status: 500 });
  }
}

// Delete chat history for a session
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return Response.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await sql`
      DELETE FROM chat_messages WHERE session_id = ${sessionId}
    `;

    return Response.json({ message: 'Chat history cleared' });

  } catch (error) {
    console.error('Error clearing chat history:', error);
    return Response.json({ error: 'Failed to clear chat history' }, { status: 500 });
  }
}