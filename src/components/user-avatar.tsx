export const UserAvatar = ({ username }: { username: string }) => {
    const getFirstLetter = (name: string): string => {
      return name ? name.charAt(0).toUpperCase() : '?';
    };
    return (
      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
        {getFirstLetter(username)}
      </div>
    );
  };
  
  export default UserAvatar;