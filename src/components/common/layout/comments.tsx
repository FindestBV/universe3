import { currentUser } from "@/api/auth/authSlice";
import UserAvatar from "@/components/common/utilities/user-avatar";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Comments = ({ connectedComments }: any) => {
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const user = useSelector(currentUser);

  console.log("connected comments", connectedComments);

  const editComment = (id: string) => {
    setIsEditing(isEditing === id ? null : id);
    console.log(`Editing comment with id ${id}`);
  };

  const deleteComment = (id: string) => {
    console.log(`Deleting comment with id ${id}`);
    setIsEditing(null);
  };

  // ✅ Recursive function to render nested replies
  const renderReplies = (replies: any[]) => {
    if (!replies || replies.length === 0) return null;

    return (
      <div className="ml-10 mt-2 border-l-2 border-gray-300 pl-4">
        {replies.map((reply) => (
          <div key={reply.id} className="group flex w-full flex-col">
            <div className="flex items-start gap-4">
              <UserAvatar username={reply.username} />
              <div className="comment comment-card relative w-full">
                <div className="flex justify-between">
                  <div>
                    <h4>{reply.username}</h4>
                    <div className="comment-meta flex">
                      <small className="comment-date">
                        {new Date(reply.dateAdded).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    </div>
                  </div>
                  {user === reply.username && (
                    <div className="absolute right-0 top-0 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" onClick={() => editComment(reply.id)}>
                        {isEditing === reply.id ? "SAVE" : "EDIT"}
                      </Button>
                      {isEditing === reply.id && (
                        <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>
                          CANCEL
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteComment(reply.id)}
                      >
                        DELETE
                      </Button>
                    </div>
                  )}
                </div>
                {isEditing === reply.id ? (
                  <form className="w-full">
                    <input
                      className="w-full italic text-gray-400"
                      placeholder={reply.text}
                      type="text"
                    />
                  </form>
                ) : (
                  <p className="comment-text mb-4 mt-4 py-2">{reply.text}</p>
                )}
                {/* ✅ Recursively Render Replies */}
                {renderReplies(reply.replies)}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
      <div className="comments-list">
        <div className="flex w-full flex-col gap-6 rounded-sm border border-[#f1f1f1] p-4">
          {connectedComments?.comments?.length > 0 ? (
            connectedComments.comments.map((comment: any) => (
              <div key={comment.id} className="group flex w-full flex-col">
                <div className="flex items-start gap-4">
                  <UserAvatar username={comment.username} />
                  <div className="comment comment-card relative w-full">
                    <div className="flex justify-between">
                      <div>
                        <h4>{comment.username}</h4>
                        <div className="comment-meta flex">
                          <small className="comment-date">
                            {new Date(comment.dateAdded).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </small>
                        </div>
                      </div>
                      {user === comment.username && (
                        <div className="absolute right-0 top-0 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button size="sm" onClick={() => editComment(comment.id)}>
                            {isEditing === comment.id ? "SAVE" : "EDIT"}
                          </Button>
                          {isEditing === comment.id && (
                            <Button size="sm" variant="ghost" onClick={() => setIsEditing(null)}>
                              CANCEL
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteComment(comment.id)}
                          >
                            DELETE
                          </Button>
                        </div>
                      )}
                    </div>
                    {isEditing === comment.id ? (
                      <form className="w-full">
                        <input
                          className="w-full italic text-gray-400"
                          placeholder={comment.text}
                          type="text"
                        />
                      </form>
                    ) : (
                      <p className="comment-text mb-4 mt-4 py-2">{comment.text}</p>
                    )}
                    {/* ✅ Recursively Render Replies */}
                    {renderReplies(comment.replies)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No comments available</p>
          )}
        </div>
      </div>
      {/* ✅ New Comment Input */}
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
