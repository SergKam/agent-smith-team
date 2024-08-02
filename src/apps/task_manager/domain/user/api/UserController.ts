import { createUser } from "./actions/createUser";
import { getAllUsers } from "./actions/getAllUsers";
import { getUserById } from "./actions/getUserById";
import { updateUserById } from "./actions/updateUserById";
import { deleteUserById } from "./actions/deleteUserById";

export default function () {
  return {
    post: createUser,
    get: getAllUsers,
    getById: getUserById,
    put: updateUserById,
    delete: deleteUserById,
  };
}
