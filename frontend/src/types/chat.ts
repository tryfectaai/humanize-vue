export type RoomType = 'group' | 'direct'

export interface Room {
  id: number
  name_id: string
  creator_id: number
  job_id: number | null
  room_type: RoomType
  direct_human_id: number | null
  creation_date: string
  members: number[]
  // Computed fields
  last_message?: Message
  unread_count?: number
  display_name?: string
  display_photo?: string | null
}

export interface Message {
  id: number
  room_id: number
  sender_id: number
  content: string
  date: string
  // Joined fields
  sender?: {
    id: number
    name: string
    profile_photo: string | null
  }
  files?: MessageFile[]
}

export interface MessageFile {
  id: number
  user_id: number
  room_id: number
  file: string
  file_name?: string
  file_type?: string
}

// WebSocket message types
export interface WsMessage {
  type: 'message' | 'typing' | 'read' | 'join' | 'leave'
  room: string
  content?: string
  sender_id?: number
}

export interface WsMessageReceived {
  type: 'message'
  room: string
  message: Message
}

export interface WsTyping {
  type: 'typing'
  room: string
  user_id: number
  is_typing: boolean
}
