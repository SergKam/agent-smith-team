import { TaskStatus } from "./TaskStatus";
import { TaskType } from "./TaskType";
import { TaskPriority } from "./TaskPriority";
import { TaskRelationType } from "./TaskRelationType";

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  assignedTo?: number;
  relations?: TaskRelation[];
}

export interface TaskRelation {
  relatedTaskId: number;
  relationType: TaskRelationType;
}
