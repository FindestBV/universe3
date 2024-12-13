export const UserAvatar = ({ username }) => {
    const getFirstLetter = (name) => {
      return name ? name.charAt(0).toUpperCase() : '?';
    };
  
    return (
      <div className="user_avatar">
        {getFirstLetter(username)}
      </div>
    );
  };
  
  export default UserAvatar;