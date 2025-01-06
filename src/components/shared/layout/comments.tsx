import { currentUser } from "@/api/auth/authSlice";
import UserAvatar from "@/components/shared/utilities/user-avatar";
import { Button } from "@/components/ui/button";

import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Comments = ({ connectedComments }: any) => {
  console.log("connected comments here", connectedComments);
  const user = useSelector(currentUser);

  return (
    <>
      <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
      <div className="comments-list">
        <div className="flex w-full gap-6 rounded-sm border border-[#f1f1f1] p-4">
          {connectedComments?.comments && connectedComments.comments.length > 0 ? (
            connectedComments.comments.map((comment: string) => (
              <>
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
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button>EDIT</Button>
                      <Button>DELETE</Button>
                    </div>
                  </div>
                  <p className="comment-text py-4">{comment?.text}</p>
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
              </>
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
