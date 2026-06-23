import { useState, useEffect } from "react";
import axios from "axios";

export default function Profile() {
  // User state initialized empty
  const [user, setUser] = useState({
    name: "",
    email: "",
    targetRole: "",
  });

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [editForm, setEditForm] = useState({
    name: "",
    targetRole: "",
  });

  const roleOptions = [
    "Software Engineer",
    "Full Stack Developer",
    "Backend Developer",
    "Frontend Developer",
    "Data Analyst",
    "AI Engineer"
  ];

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Failed to load profile data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Helper to get initials (First letter of first name + First letter of last name)
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isSaving) return; // Prevent duplicate submissions

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    
    try {
      const token = localStorage.getItem("token");

console.log("TOKEN =", token);

      const response = await axios.put(
        "http://localhost:8080/profile",
        {
          name: editForm.name,
          targetRole: editForm.targetRole,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Update local UI state with backend response instantly
      setUser(response.data);
      setIsModalOpen(false);
      setSaveSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setSaveError(err.response?.data?.message || "Failed to update profile. Please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenModal = () => {
    setEditForm({ 
      name: user.name || "", 
      targetRole: user.targetRole || "" 
    });
    setSaveError(null);
    setSaveSuccess(false);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-4 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">My Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-sm mb-6">
          <p className="font-semibold text-sm">{error}</p>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-sm mb-6">
          <p className="font-semibold text-sm">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Profile Header & Quick Actions */}
        <div className="space-y-6 lg:col-span-1">
          
          {/* SECTION 1: PROFILE HEADER */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-indigo-600 text-3xl font-extrabold mb-4 shadow-sm">
              {getInitials(user.name)}
            </div>
            <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
            <p className="text-sm text-slate-500 mb-3">{user.email}</p>
            <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full border ${user.targetRole ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
              {user.targetRole || "Not Selected"}
            </span>
          </div>

          {/* SECTION 4: QUICK ACTIONS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-3">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleOpenModal}
                className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Edit Profile
              </button>
              <button 
                onClick={handleOpenModal}
                className="w-full bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-sm border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                Change Target Role
              </button>
              <button 
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors mt-4"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Account Info & Status */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* SECTION 2: ACCOUNT INFORMATION */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Account Information</h3>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Name</label>
                <p className="text-base font-bold text-slate-800">{user.name}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                <p className="text-base font-bold text-slate-800">{user.email}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Target Role</label>
                <p className="text-base font-bold text-slate-800">{user.targetRole || "Not Selected"}</p>
              </div>
            </div>
          </div>

          {/* SECTION 3: ACCOUNT STATUS */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Active Features</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-emerald-800">Resume Analysis Enabled</p>
              </div>
              
              <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-emerald-800">Interview Prep Enabled</p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-bold text-emerald-800">Career Roadmap Enabled</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 5 & 6: EDIT PROFILE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6">Edit Profile</h2>
            
            {saveError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-sm font-medium">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Role</label>
                <select
                  required
                  value={editForm.targetRole}
                  onChange={(e) => setEditForm({...editForm, targetRole: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 font-medium bg-white appearance-none"
                >
                  <option value="" disabled>Select your target role</option>
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed font-medium"
                />
                <p className="text-xs text-slate-400 mt-1">Email address cannot be changed.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving && (
                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}