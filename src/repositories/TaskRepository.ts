import pool from '../db';
import { Task, TaskRelation } from '../models/Task';

export class TaskRepository {
    async createTask(task: Task): Promise<number> {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                `INSERT INTO tasks (title, description, status, type, priority, assignedTo) VALUES (?, ?, ?, ?, ?, ?)`,
                [task.title, task.description || null, task.status, task.type, task.priority, task.assignedTo || null]
            );
            return (result as any).insertId;
        } finally {
            connection.release();
        }
    }

    async createTaskRelations(taskId: number, relations: TaskRelation[]): Promise<void> {
        const connection = await pool.getConnection();
        try {
            const relationQueries = relations.map((relation: TaskRelation) =>
                connection.execute(
                    `INSERT INTO task_relations (taskId, relatedTaskId, relationType) VALUES (?, ?, ?)`,
                    [taskId, relation.relatedTaskId, relation.relationType]
                )
            );
            await Promise.all(relationQueries);
        } finally {
            connection.release();
        }
    }
}
