import axios from "axios";
import { Issue } from "./github/ghTypes";
import { config } from "./config";

// GitHub API client

export const createTaskManager = (config: {
  repoOwner: string;
  repoName: string;
  humanUser: string;
  robotUser: string;
  githubToken: string;
}) => {
  const client = axios.create({
    baseURL: `https://api.github.com/repos/${config.repoOwner}/${config.repoName}`,
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
    try {
      const response = await client.post<Issue>("/issues", {
        title,
        body,
        labels,
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error creating task: ${error}`);
    }
  };
  const addComment = async (issueNumber: string, comment: string) => {
    try {
      const response = await client.post<{ id: number }>(
        `/issues/${issueNumber}/comments`,
        {
          body: comment,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(`Error adding comment to issue #${issueNumber}: ${error}`);
    }
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
        .map((comment: any) => `\nUser ${comment.user.login}:${comment.body}`)
        .filter((comment: any) => !comment.startsWith("--logs--"));

      return issue;
    } catch (error: any) {
      console.error("Error fetching task:", error);
      return null;
    }
  };

  const createPullRequest = async (issue: Issue) => {
    try {
      await client.post(`/pulls`, {
        title: `Issue #${issue.number}: ${issue.title}`,
        head: `issue-${issue.number}`,
        body: `This PR was created automatically to address issue #${issue.number}.
        ** ${issue.title} **`,
        base: "main",
      });
      await client.post(`/issues/${issue.number}/labels`, {
        labels: ["code review"],
      });
      console.log("PR created successfully");
    } catch (error: any) {
      console.error(`Error creating PR for issue #${issue.number}: ${error}`);
    }
  };

  const setLabels = async (issue: Issue, labels: string[]) => {
    try {
      await client.put(`/issues/${issue.number}/labels`, {
        labels: labels,
      });
      console.log(`Labels set for issue #${issue.number}: ${labels}`);
    } catch (error: any) {
      console.error(
        `Error setting labels for issue #${issue.number}: ${error}`
      );
    }
  };

  const reassignTask = async (issue: Issue) => {
    try {
      await client.patch(`/issues/${issue.number}`, {
        assignees: [config.humanUser],
      });
      console.log(`Reassigned issue #${issue.number} to ${config.humanUser}`);
    } catch (error: any) {
      console.error(
        `Error reassigning task for issue #${issue.number}: ${error}`
      );
    }
  };

  // Wait for a task with the given label to be assigned to the robot user
  const waitForTask = (label: string): Promise<Issue> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const issue = await fetchTask(label);
        if (issue) {
          resolve(issue);
        } else {
          resolve(await waitForTask(label));
        }
      }, 10000);
    });
  };

  return {
    createTask,
    fetchTask,
    waitForTask,
    addComment,
    reassignTask,
    createPullRequest,
    setLabels,
  };
};

export const taskManager = createTaskManager({
  githubToken: config("GITHUB_TOKEN"),
  repoOwner: config("REPO_OWNER"),
  repoName: config("REPO_NAME"),
  robotUser: config("ROBOT_USER"),
  humanUser: config("HUMAN_USER"),
});
