import { useState } from "react";

const AddUsersForm = () => {
  const [email, setEmail] = useState(""); // Current email input
  const [users, setUsers] = useState<string[]>([]); // List of added users

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === "") return; // Ignore empty inputs
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setUsers((prevUsers) => [...prevUsers, email]);
    setEmail(""); // Clear the input
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="add-users-form">
      <form className="flex gap-2" onSubmit={handleAddUser}>
        <input
          type="text"
          name="add_users"
          placeholder="Type users to add"
          className="w-3/4 rounded-md border p-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="w-1/4 rounded-md bg-gray-400 p-4 text-center text-white hover:bg-blue-400"
        >
          Add
        </button>
      </form>
      <div className="mt-4">
        <h3 className="font-bold">Added Users:</h3>
        {users.length > 0 ? (
          <ul className="list-disc pl-4">
            {users.map((user, index) => (
              <li key={index} className="text-gray-700">
                {user}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No users added yet.</p>
        )}
      </div>
    </div>
  );
};

export default AddUsersForm;
