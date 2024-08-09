import { Request, Response } from "express";
import { paths } from "../../../../types/api-types";
import { CommentService } from "../../services/CommentService";

type PostCommentRequest =
  paths["/comments"]["post"]["requestBody"]["content"]["application/json"];
type PostCommentResponse =
  paths["/comments"]["post"]["responses"]["201"]["content"]["application/json"];

export const addComment = async (req: Request, res: Response) => {
  const commentService = new CommentService();
  const commentData: PostCommentRequest = req.body;

  const createdComment = await commentService.addCommentToTask(commentData.taskId, commentData);
  const response: PostCommentResponse = createdComment as PostCommentResponse;
  res.status(201).json(response);
};