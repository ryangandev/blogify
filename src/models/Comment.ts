interface Comment {
    id: string;
    postId: string;
    authorId: string;
    parentId?: string;
    content: string;
    hasChildren: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export type { Comment };
