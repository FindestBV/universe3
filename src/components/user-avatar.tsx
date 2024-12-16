import React from "react";

export const UserAvatar = React.forwardRef(({ username }, ref) => {
  const getFirstLetter = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div ref={ref} className="user_avatar">
      {getFirstLetter(username)}
    </div>
  );
});

UserAvatar.displayName = "UserAvatar"; // Helpful for debugging

export default UserAvatar;
