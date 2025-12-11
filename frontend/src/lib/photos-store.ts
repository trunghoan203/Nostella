import { create } from "zustand";
import { api } from "./api";

export interface Photo {
  id: string;
  url: string;
  caption: string;
  createdAt: string;
  takenAt: string;
  userId: string;
  key: string;
  isFavorite?: boolean;
  description?: string;
  location?: string;
}

export interface PhotoWithMeta extends Photo {
  tags: string[];
  story?: string;
  date: string;
  year: string;
  month: string;
  title: string;
  imageUrl: string;
  location?: string;
  isFavorite: boolean;
  hasAiStory: boolean;
  takenAtDate?: Date;
  description?: string;
}

export interface UpdatePhotoPayload {
  caption?: string;
  description?: string;
  takenAt?: string;
  location?: string;
}

interface PhotosState {
  photos: PhotoWithMeta[];
  isLoading: boolean;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
  fetchPhotos: () => Promise<void>;
  uploadPhoto: (file: File, caption: string) => Promise<void>;
  deletePhoto: (id: string) => Promise<void>;
  updatePhoto: (id: string, payload: UpdatePhotoPayload) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  generateAiStory: (photoId: string) => Promise<string>;
}

function transformPhoto(photo: Photo): PhotoWithMeta {
  const createdDate = new Date(photo.createdAt);
  const takenAtDate = photo.takenAt ? new Date(photo.takenAt) : undefined;
  const displayDate = takenAtDate || createdDate;
  return {
    ...photo,
    imageUrl: photo.url,
    title: photo.caption || "Untitled Memory",
    date: displayDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    year: displayDate.getFullYear().toString(),
    month: (displayDate.getMonth() + 1).toString().padStart(2, "0"),
    location: photo.location || undefined,
    isFavorite: photo.isFavorite ?? false,
    hasAiStory: false,
    tags: [],
    story: undefined,
    takenAtDate: takenAtDate,
    description: photo.description || undefined,
  };
}

export const usePhotosStore = create<PhotosState>((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,
  uploadProgress: 0,
  isUploading: false,

  fetchPhotos: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<Photo[]>("/photos");
      const photos = response.data.map(transformPhoto);
      set({ photos, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch photos";
      set({ error: message, isLoading: false });
    }
  },

  uploadPhoto: async (file: File, caption: string) => {
    set({ isUploading: true, uploadProgress: 0, error: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);

      const response = await api.post("/photos/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: any) => {
          const total = progressEvent.total || progressEvent.estimated || 0;
          const progress = total
            ? Math.round((progressEvent.loaded * 100) / total)
            : 0;
          set({ uploadProgress: progress });
        },
      } as any);

      const newPhotoData = response.data as Photo;
      const newPhoto = transformPhoto(newPhotoData);

      set((state) => ({
        photos: [newPhoto, ...state.photos],
        isUploading: false,
        uploadProgress: 100,
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to upload photo";
      set({ error: message, isUploading: false, uploadProgress: 0 });
      throw new Error(message);
    }
  },

  deletePhoto: async (id: string) => {
    try {
      await api.delete(`/photos/${id}`);

      set((state) => ({
        photos: state.photos.filter((p) => p.id !== id),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete photo";
      throw new Error(message);
    }
  },

  updatePhoto: async (id: string, payload: UpdatePhotoPayload) => {
    try {
      await api.patch(`/photos/${id}`, payload);

      set((state) => ({
        photos: state.photos.map((p) => {
          if (p.id !== id) return p;

          const updatedTakenAt = payload.takenAt
            ? new Date(payload.takenAt)
            : p.takenAtDate || new Date(p.takenAt);

          return {
            ...p,
            caption: payload.caption ?? p.caption,
            title: payload.caption ?? p.title,
            description: payload.description ?? p.description,
            location: payload.location ?? p.location,
            takenAt: updatedTakenAt.toISOString(),
            takenAtDate: updatedTakenAt,
            date: updatedTakenAt.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            year: updatedTakenAt.getFullYear().toString(),
            month: (updatedTakenAt.getMonth() + 1).toString().padStart(2, "0"),
          };
        }),
      }));
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update photo";
      throw new Error(message);
    }
  },

  toggleFavorite: async (id: string) => {
    try {
      await api.post(`/photos/${id}/favorite`);
      set((state) => ({
        photos: state.photos.map((p) =>
          p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
        ),
      }));
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update favorite";
      throw new Error(message);
    }
  },

  generateAiStory: async (photoId: string) => {
    try {
      const response = await api.post<{ story: string }>(
        `/ai/generate/${photoId}`
      );
      const { story } = response.data;

      set((state) => ({
        photos: state.photos.map((p) =>
          p.id === photoId ? { ...p, story: story, hasAiStory: true } : p
        ),
      }));

      return story;
    } catch (error: any) {
      console.error("AI Generation failed", error);
      throw new Error(
        error.response?.data?.message || "Failed to generate story"
      );
    }
  },
}));
