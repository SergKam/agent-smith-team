export interface Comment {
    id?: number;
    taskId: number;
    userId: number;
    content: string;
    createdAt?: string;
}

export interface CommentInput {
    taskId: number;
    userId: number;
    content: string;
}