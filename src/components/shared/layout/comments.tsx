import { currentUser } from "@/api/auth/authSlice";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Comments = ({ connectedComments }: any) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const user = useSelector(currentUser);

  // const addComment = (id) => {
  //   setIsEditing(!isEditing);
  //   console.log(`adding comment with id ${comment.id}`)
  // }

  const editComment = (id) => {
    setIsEditing(!isEditing);
    console.log(`editing comment with id ${id}`);
  };

  const deleteComment = (id) => {
    setIsEditing(true);
    console.log(`deleting comment with id ${id}`);
    setIsEditing(false);
  };

  return (
    <>
      <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
      <div className="comments-list">
        <div className="flex w-full gap-6 rounded-sm border border-[#f1f1f1] p-4">
          {connectedComments?.comments && connectedComments.comments.length > 0 ? (
            connectedComments.comments.map((comment: string) => (
              <div key={comment.id} className="flex w-full">
                <UserAvatar username={comment?.username} />
                <div className="comment comment-card group w-full">
                  <div className="flex justify-between">
                    <div>
                      <h4>{comment?.username}</h4>
                      <div className="comment-meta flex">
                        <small className="comment-date">
                          {new Date(comment?.dateAdded).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </div>
                    {/* Buttons only visible on hover */}
                    {(user && user === comment.username) ||
                      ("Ronan" && (
                        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {/* TODO: Make this accessible only if Admin or if signed in user is the same as the comment user */}
                          <Button onClick={() => editComment(comment.id)}>EDIT</Button>
                          <Button onClick={() => deleteComment(comment.id)}>DELETE</Button>
                        </div>
                      ))}
                  </div>
                  {isEditing ? (
                    <form className="w-full">
                      <input
                        className="w-full italic text-gray-400"
                        placeholder={comment?.text}
                        type="text"
                      />
                    </form>
                  ) : (
                    <p className="comment-text mb-4 mt-4 py-2">{comment?.text}</p>
                  )}
                  <div className="flex gap-6 rounded-sm border border-[#f1f1f1] p-4">
                    <form className="w-full">
                      <input
                        className="w-full italic text-gray-400"
                        placeholder="Write your reply here"
                        type="text"
                      />
                    </form>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </div>
      <div className="mt-6 flex gap-6 rounded-sm border border-[#f1f1f1] p-4">
        <UserAvatar username={user} />
        <form className="w-full">
          <input
            className="w-full italic text-gray-400"
            type="text"
            placeholder="Write your comment here"
          />
        </form>
      </div>
    </>
  );
};

export default Comments;
