import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { CommentService } from "../../services/CommentService";

type GetCommentsResponse =
  paths["/comments"]["get"]["responses"]["200"]["content"]["application/json"];

export const getComments = async (req: Request, res: Response) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter as string) : {};
  const taskId = filter.taskId;
  const commentService = new CommentService();
  const comments = taskId
    ? await commentService.getCommentsByTaskId(taskId)
    : await commentService.getAllComments();
  const response: GetCommentsResponse = comments as GetCommentsResponse;
  res.header(
    "Content-Range",
    `comments 0-${comments.length}/${comments.length}`
  );
  res.status(200).json(response);
};