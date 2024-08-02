import { TaskStatus } from "./models/TaskStatus";
import { TaskType } from "./models/TaskType";
import { TaskPriority } from "./models/TaskPriority";
import { TaskRelationType } from "./models/TaskRelationType";

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
