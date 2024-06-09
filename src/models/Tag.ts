interface Tag {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

interface TaggedPost {
    postId: string;
    tagId: string;
}

export type { Tag, TaggedPost };
