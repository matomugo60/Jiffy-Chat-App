export interface Message {
    text: string,
    uid: string,
    photoURL: string,
    id: string
}

export type ChatMessageProps = {
    message: Message,
    key: string
}

// export interface ChatMessageProps {
//     message: Message;
//   }
  
//   export interface Message {
//     id: string;
//     text: string;
//     uid: string;
//     photoURL: string;
//   }
  