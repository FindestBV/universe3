import React from "react";

export type UserAvatarProps = {
  username?: string;
  name?: string;
};

export const UserAvatar = React.forwardRef(({ username }: UserAvatarProps, ref) => {
  const getFirstLetter = (name: string | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="user_avatar">
      {getFirstLetter(username)}
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";
export default UserAvatar;
