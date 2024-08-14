import axios from "axios";
import { exec } from "child_process";
import util from "util";
import "dotenv/config";

const execPromise = util.promisify(exec);

const TASK_MANAGER_API_URL = process.env.TASK_MANAGER_API_URL;
if (!TASK_MANAGER_API_URL) {
  throw new Error("TASK_MANAGER_API_URL environment variable is required");
}
const agentId = parseInt(process.env.AGENT_ID || "", 10);
if (!agentId) {
  throw new Error("AGENT_ID environment variable is required");
}
const client = axios.create({
  baseURL: TASK_MANAGER_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.agntId}`,
    "Content-Type": "application/json",
  },
});

const fetchTask = async () => {
  try {
    const filter = JSON.stringify({ status: "pending", assignedTo: agentId });
    const response = await client.get(`/tasks?filter=${filter}`);
    if (response.data && response.data.length > 0) {
      return response.data[0]; // Assuming the first task is the one to be processed
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching task:", error.message);
    return null;
  }
};

const runTask = async (task: any) => {
  try {
    const { stdout, stderr } = await execPromise(
      `echo '${JSON.stringify(task, null, 2)}'`
    );
    console.log("Task output:", stdout);
    if (stderr) {
      console.error("Task error output:", stderr);
    }
    return { stdout, stderr };
  } catch (error) {
    console.error("Error running task:", error);
    return { stdout: "", stderr: `${error}` };
  }
};
const finishTask = async (task: any, stdout: string, stderr: string) => {
  try {
    await client.put(`tasks/${task.id}`, {
      ...task,
      userId: agentId,
      status: "completed",
    });

    await client.post(`comments`, {
      taskId: task.id,
      userId: agentId,
      content: `Task completed. Output: ${stdout}. Error: ${stderr}`,
    });

    console.log("Task completed successfully");
  } catch (error: any) {
    console.error("Error finishing task:", error.message, error.response?.data);
  }
};

const main = async () => {
  while (true) {
    const task = await fetchTask();
    if (!task) {
      console.log("No tasks available. Retrying in 10 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      continue;
    }
    let { stdout, stderr } = await runTask(task);
    await finishTask(task, stdout, stderr);
  }
};

main().catch(console.error);
