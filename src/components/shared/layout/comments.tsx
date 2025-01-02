import { currentUser } from "@/api/auth/authSlice";
import UserAvatar from "@/components/shared/utilities/user-avatar";

import { useSelector } from "react-redux";

export const Comments = () => {
  const user = useSelector(currentUser);

  return (
    <>
      <h3 className="my-4 flex-1 text-3xl font-black text-black">Comments</h3>
      <div className="flex gap-6 rounded-sm border border-[#f1f1f1] p-4">
        <UserAvatar username={user} />
        <p className="italic text-gray-400">Write your comment here</p>
      </div>
    </>
  );
};

export default Comments;
