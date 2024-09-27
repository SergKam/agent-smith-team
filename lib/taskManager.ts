import axios from "axios";
import { Issue } from "./github/ghTypes";
import { config } from "./config";

// GitHub API client

export const createTaskManager = (config: {
  repoName: string;
  humanUser: string;
  robotUser: string;
  githubToken: string;
}) => {
  const client = axios.create({
    baseURL: `https://api.github.com/repos/${config.repoName}`,
    headers: {
      Authorization: `Bearer ${config.githubToken}`,
      Accept: "application/vnd.github+json",
    },
  });

  const createTask = async (
    title: string,
    body: string,
    labels: string[] = []
  ) => {
    const response = await client.post<Issue>("/issues", {
      title,
      body,
      labels,
    });
    return response.data;
  };

  const addComment = async (issueNumber: string, comment: string) => {
    const response = await client.post<{ id: number }>(
      `/issues/${issueNumber}/comments`,
      {
        body: comment,
      }
    );
    return response.data;
  };

  const fetchTask = async (label: string) => {
    try {
      const response = await client.get(`/issues`, {
        params: {
          assignee: config.robotUser,
          state: "open",
          labels: label,
          sort: "created",
          direction: "asc",
        },
      });
      if (response.data.length === 0) {
        console.log(`No tasks found for label: ${label}`);
        return null;
      }
      const issue = response.data[0] as Issue;

      console.log(`Fetched task #${issue.number}: ${issue.title}`);
      // load all comments of this issue
      const comments = await client.get(`/issues/${issue.number}/comments`);

      issue.comment_bodies = comments.data
        .filter((comment: any) => !comment.body.startsWith("--logs--"))
        .map((comment: any) => `\nUser ${comment.user.login}:${comment.body}`);

      return issue;
    } catch (error: any) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  const createPullRequest = async (
    issue: Issue,
    branch: string,
    text: string
  ) => {
    await client.post(`/pulls`, {
      title: `Issue #${issue.number}: ${issue.title}`,
      head: branch,
      body: `This PR was created automatically to address issue #${issue.number}.
        ** ${issue.title} **
        Agent: ${text}
        `,
      base: "main",
    });

    await client.post(`/issues/${issue.number}/labels`, {
      labels: ["ready-for-review"],
    });

    console.log("PR created successfully");
  };

  const setLabels = async (issue: Issue, labels: string[]) => {
    await client.put(`/issues/${issue.number}/labels`, {
      labels: labels,
    });
    console.log(`Labels set for issue #${issue.number}: ${labels}`);
  };

  const reassignTask = async (issue: Issue) => {
      await client.patch(`/issues/${issue.number}`, {
        assignees: [config.humanUser],
      });
      console.log(`Reassigned issue #${issue.number} to ${config.humanUser}`);
  };

  return {
    createTask,
    fetchTask,
    addComment,
    reassignTask,
    createPullRequest,
    setLabels,
  };
};

export const taskManager = createTaskManager({
  githubToken: config("GITHUB_TOKEN"),
  repoName: config("TASK_MANAGER_NAME"),
  robotUser: config("ROBOT_USER"),
  humanUser: config("HUMAN_USER"),
});
