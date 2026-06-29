import type { Book } from '@/types/novel'

const API_BASE = '/api'

export const DEFAULT_BOOK_ID = 'loen'

export function emptyBook(id = DEFAULT_BOOK_ID): Book {
  return { id, title: '載入中…', author: '', tags: [], cover: '', volumes: [] }
}

export async function fetchBook(id: string = DEFAULT_BOOK_ID): Promise<Book> {
  const res = await fetch(`${API_BASE}/books/${id}`)
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}))
    throw new Error(msg.error || `讀取失敗(${res.status})`)
  }
  return (await res.json()) as Book
}

// 卷清單(上傳頁下拉用)
export interface VolumeBrief {
  order: number
  title: string
}
export async function fetchVolumes(bookId: string = DEFAULT_BOOK_ID): Promise<VolumeBrief[]> {
  const res = await fetch(`${API_BASE}/books/${bookId}/volumes`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `讀取失敗(${res.status})`)
  return (data.volumes ?? []) as VolumeBrief[]
}

// number 已不再需要(後端依 index 自動產生中文章節號)
export interface ChapterPayload {
  volumeOrder: number
  volumeTitle: string
  chapterIndex: number
  title: string
  content: string
}

export interface ChapterDetail extends ChapterPayload {
  file: string
}

export async function fetchChapter(
  chapterId: string,
  bookId: string = DEFAULT_BOOK_ID,
): Promise<ChapterDetail> {
  const res = await fetch(`${API_BASE}/books/${bookId}/chapters/${chapterId}`)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `讀取失敗(${res.status})`)
  return data as ChapterDetail
}

export async function uploadChapter(
  payload: ChapterPayload,
  bookId: string = DEFAULT_BOOK_ID,
): Promise<{ ok: boolean; file: string; message: string }> {
  const res = await fetch(`${API_BASE}/books/${bookId}/chapters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `新增失敗(${res.status})`)
  return data
}

export async function updateChapter(
  chapterId: string,
  payload: ChapterPayload,
  bookId: string = DEFAULT_BOOK_ID,
): Promise<{ ok: boolean; file: string; message: string }> {
  const res = await fetch(`${API_BASE}/books/${bookId}/chapters/${chapterId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `更新失敗(${res.status})`)
  return data
}
