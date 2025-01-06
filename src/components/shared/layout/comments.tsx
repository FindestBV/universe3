import { currentUser } from "@/api/auth/authSlice";
import UserAvatar from "@/components/shared/utilities/user-avatar";

import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Comments = ({ connectedComments }: any) => {
  console.log("connected comments here", connectedComments);
  const user = useSelector(currentUser);

  return (
    <>
      <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
      <div className="comments-list">
        {connectedComments?.comments && connectedComments.comments.length > 0 ? (
          connectedComments.comments.map((comment: string) => (
            <div key={comment?.id} className="comment-card">
              <p className="comment-text">{comment?.text}</p>
              <div className="comment-meta">
                <span className="comment-username">{comment?.username}</span>
                <span className="comment-date">
                  {new Date(comment?.dateAdded).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>No comments available</p>
        )}
      </div>
      <div className="flex gap-6 rounded-sm border border-[#f1f1f1] p-4">
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
