import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


import {
  Users,
  Shield,
  User,
  Search,
  Mail,
  CalendarDays
} from "lucide-react";


const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      setUsers(
        Array.isArray(data)
          ? data
          : []
      );
    } 
    catch (error) { console.error(error);} 
    finally {setLoading(false);}
  };
  if (user) { fetchUsers();}
}, [user]);


  const filteredUsers = users.filter(
    (u) =>
      u.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      u.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
  <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

    {/* Header */}

    <div className="flex items-center gap-4 mb-8">

      <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center">
        <Users
          size={28}
          className="text-orange-600"
        />
      </div>

      <div>

        <h1 className="text-4xl font-bold">
          User Directory
        </h1>

        <p className="text-gray-500">
          Manage registered users
        </p>

      </div>

    </div>

    {/* Stats */}

    <div className="grid md:grid-cols-3 gap-5 mb-8">

      <div className="bg-white border rounded-3xl p-6 shadow-sm">

        <Users
          size={26}
          className="text-orange-500 mb-3"
        />

        <p className="text-gray-500">
          Total Users
        </p>

        <h2 className="text-3xl font-bold">
          {users.length}
        </h2>

      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm">

        <Shield
          size={26}
          className="text-purple-500 mb-3"
        />

        <p className="text-gray-500">
          Admins
        </p>

        <h2 className="text-3xl font-bold">
          {
            users.filter(
              (u) => u.role === "admin"
            ).length
          }
        </h2>

      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm">

        <User
          size={26}
          className="text-blue-500 mb-3"
        />

        <p className="text-gray-500">
          Customers
        </p>

        <h2 className="text-3xl font-bold">
          {
            users.filter(
              (u) => u.role === "user"
            ).length
          }
        </h2>

      </div>

    </div>

    {/* Search */}

    <div className="relative mb-8">

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          pl-12
          pr-4
          py-4
          border
          rounded-2xl
          focus:ring-2
          focus:ring-orange-500
          outline-none
        "
      />

    </div>

    {/* Loading */}

    {loading ? (

      <div className="text-center py-20 text-gray-500">
        Loading users...
      </div>

    ) : filteredUsers.length === 0 ? (

      <div className="bg-white border rounded-3xl p-10 text-center">

        <h3 className="text-xl font-semibold">
          No Users Found
        </h3>

      </div>

    ) : (

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredUsers.map((u) => (

          <div
            key={u._id}
            className="
              bg-white
              border
              rounded-3xl
              p-6
              shadow-sm
              hover:shadow-lg
              transition
            "
          >

            {/* Avatar */}

            <div className="flex items-center gap-4 mb-5">

              <div
                className="
                  w-14
                  h-14
                  rounded-full
                  bg-orange-100
                  flex
                  items-center
                  justify-center
                "
              >

                <User
                  size={26}
                  className="text-orange-600"
                />

              </div>

              <div>

                <h3 className="font-bold text-lg">
                  {u.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  ID:
                  {" "}
                  {u._id.substring(0, 8)}
                </p>

              </div>

            </div>

            {/* Email */}

            <div className="flex items-center gap-2 text-gray-600 mb-3">

              <Mail size={16} />

              <span className="break-all">
                {u.email}
              </span>

            </div>

            {/* Joined */}

            <div className="flex items-center gap-2 text-gray-600 mb-5">

              <CalendarDays size={16} />

              {new Date(
                u.createdAt
              ).toLocaleDateString()}

            </div>

            {/* Role */}

            <span
              className={`
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                ${
                  u.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }
              `}
            >
              {u.role.toUpperCase()}
            </span>

          </div>

        ))}
      </div>
    )}
  </div>
);
};

export default AdminUsers;