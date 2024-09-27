import { config } from "./config";
import { execAsync } from "./fileUtils";
import { Issue } from "./github/ghTypes";
import { Agent } from "./agent";

export type Project = {
  name: string;
  git: string;
  branch: string;
  include: string[];
  exclude: string[];
  workspace: string;
};

export const defaultProject: Project = {
  name: config("PROJECT_NAME"),
  git: config("PROJECT_GIT"),
  branch: config("PROJECT_BRANCH"),
  include: config("PROJECT_INCLUDE").split(","),
  exclude: config("PROJECT_EXCLUDE").split(","),
  workspace: config("PROJECT_WORKSPACE_PATH"),
};

export const clone = async (
  agentName: string,
  project: Project = defaultProject
) => {
  const workspace = `${project.workspace}/${agentName}`;
  await execAsync(`rm -rf ${workspace}`);

  await execAsync(
    `git clone -q -b ${project.branch}  --depth=1 ${project.git} ${workspace}`
  );
  process.chdir(workspace);
  await execAsync(`git config  user.email "agent.${agentName}@example.com"`);
  await execAsync(`git config user.name "agent-${agentName}"`);
  await execAsync(`git config push.autoSetupRemote true`);
};

export const createBranch = async (issue: Issue) => {
  const safeTitle = issue.title
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "-")
    .substring(0, 50);
  const branch = `issue-${issue.number}-${safeTitle}`;
  await execAsync(`git checkout -b ${branch}`);
  return branch;
};
export const getCurrentBranch = async () => {
  const { stdout } = await execAsync(`git rev-parse --abbrev-ref HEAD`);
  return stdout.trim();
};

export const cleanup = async (
  agentName: string,
  project: Project = defaultProject
) => {
  process.chdir("../..");
  const workspace = `${project.workspace}/${agentName}`;
  await execAsync(`rm -rf ${workspace}`);
};

export const commit = async (agent: Agent, issue: Issue, message: string) => {
  // Commit the changes
  await execAsync(`git add .`);
  await execAsync(`git commit -m 'Issue #${issue.number}: ${message}'`);

  // Push the changes
  await execAsync(`git push origin`);
};

export const project = {
  config: defaultProject,
  getCurrentBranch,
  clone,
  createBranch,
  cleanup,
  commit,
};
