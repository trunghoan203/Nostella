import { create } from "zustand";
import { api } from "./api";

export interface GreetingCard {
  id: string;
  senderId: string;
  senderName: string;
  receiverEmail: string;
  title: string;
  message: string;
  imageUrl: string | null;
  scheduledAt: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    fullName: string;
    email: string;
  };
}

interface GreetingCardsState {
  cards: GreetingCard[];
  unreadCount: number;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;

  fetchCards: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  checkReceiverEmail: (
    email: string
  ) => Promise<{ id: string; fullName: string } | null>;
  createCard: (payload: {
    receiverEmail: string;
    title: string;
    message: string;
    imageUrl: string | null;
    scheduledAt: string;
  }) => Promise<boolean>;
  markAsRead: (cardId: string) => Promise<void>;
}

const isAxiosErrorWithMessage = (
  error: unknown
): error is {
  response?: { data?: { message?: string } };
} => {
  return typeof error === "object" && error !== null && "response" in error;
};

export const useGreetingCardsStore = create<GreetingCardsState>((set, get) => ({
  cards: [],
  unreadCount: 0,
  isLoading: false,
  isSending: false,
  error: null,

  fetchCards: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.get<GreetingCard[]>("/greeting-cards");
      set({ cards: response.data, isLoading: false });
    } catch (err: unknown) {
      if (isAxiosErrorWithMessage(err)) {
        set({
          error:
            err.response?.data?.message ?? "Failed to fetch greeting cards",
          isLoading: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isLoading: false,
        });
      }
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await api.get<{ count: number }>(
        "/greeting-cards/unread-count"
      );
      set({ unreadCount: response.data.count });
    } catch (err: unknown) {
      console.error("Failed to fetch unread count", err);
    }
  },

  checkReceiverEmail: async (email: string) => {
    try {
      const response = await api.get<{ id: string; fullName: string }>(
        "/greeting-cards/check-user",
        { params: { email } }
      );
      return response.data;
    } catch {
      return null;
    }
  },

  createCard: async (payload) => {
    set({ isSending: true, error: null });

    try {
      await api.post("/greeting-cards", payload);
      await get().fetchCards();
      set({ isSending: false });
      return true;
    } catch (err: unknown) {
      if (isAxiosErrorWithMessage(err)) {
        set({
          error: err.response?.data?.message ?? "Failed to send greeting card",
          isSending: false,
        });
      } else {
        set({
          error: "Unexpected error occurred",
          isSending: false,
        });
      }
      return false;
    }
  },

  markAsRead: async (cardId: string) => {
    try {
      await api.patch(`/greeting-cards/${cardId}/read`);
      set((state) => ({
        cards: state.cards.map((card) =>
          card.id === cardId ? { ...card, isRead: true } : card
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err: unknown) {
      console.error("Failed to mark card as read", err);
    }
  },
}));
