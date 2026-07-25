/**
 * src/store/slices/chatSlice.js
 * ----------------------------------------------------------------------------
 * Owns Chat Sessions + Messages (Flow 3: AI Product Assistant).
 *
 * State shape:
 *   {
 *     sessions: Array<{ id, title, createdAt }>,
 *     activeSessionId: string | null,
 *     messagesBySession: Record<sessionId, Array<{ id, senderRole, content, createdAt }>>,
 *     status: 'idle' | 'loading' | 'succeeded' | 'failed',
 *     error: string | null
 *   }
 *
 * Note: real-time token-by-token streaming text is NOT stored here — that's
 * transient UI state owned by src/hooks/useChatStream.js. Once a stream
 * completes, the final message is appended to `messagesBySession` via
 * `appendMessage` (a plain reducer, not a thunk).
 *
 * Consumed by:
 *   - src/components/adminPortal/chat/ChatSessionList.jsx
 *   - src/components/adminPortal/chat/ChatWindow.jsx
 * ----------------------------------------------------------------------------
 */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as chatApi from "../../api/chatApi";

export const loadSessions = createAsyncThunk("chat/loadSessions", async () => {
  return chatApi.fetchChatSessions();
});

export const startSession = createAsyncThunk("chat/startSession", async (title) => {
  return chatApi.createChatSession(title);
});

export const loadMessages = createAsyncThunk("chat/loadMessages", async (sessionId) => {
  const messages = await chatApi.fetchChatMessages(sessionId);
  return { sessionId, messages };
});

export const sendMessageThunk = createAsyncThunk(
  "chat/sendMessage",
  async ({ sessionId, content }) => {
    const message = await chatApi.sendChatMessage(sessionId, content);
    return { sessionId, message };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    sessions: [],
    activeSessionId: null,
    messagesBySession: {},
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveSession(state, action) {
      state.activeSessionId = action.payload;
    },
    /** Used by useChatStream to push the finalized assistant message once a
     * streamed response completes, without re-fetching the whole list. */
    appendMessage(state, action) {
      const { sessionId, message } = action.payload;
      if (!state.messagesBySession[sessionId]) {
        state.messagesBySession[sessionId] = [];
      }
      state.messagesBySession[sessionId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSessions.fulfilled, (state, action) => {
        state.sessions = action.payload;
      })
      .addCase(startSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
        state.activeSessionId = action.payload.id;
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messagesBySession[action.payload.sessionId] = action.payload.messages;
      })
      .addCase(sendMessageThunk.fulfilled, (state, action) => {
        const { sessionId, message } = action.payload;
        if (!state.messagesBySession[sessionId]) {
          state.messagesBySession[sessionId] = [];
        }
        state.messagesBySession[sessionId].push(message);
      });
  },
});

export const { setActiveSession, appendMessage } = chatSlice.actions;
export default chatSlice.reducer;
