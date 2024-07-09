export interface Task {
    id?: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'completed';
    type: 'story' | 'task' | 'question' | 'bug';
    priority: 'low' | 'medium' | 'high' | 'critical';
    assignedTo?: number;
    relations?: TaskRelation[];
}

export interface TaskRelation {
    relatedTaskId: number;
    relationType: 'blocked' | 'parent' | 'child' | 'related';
}
