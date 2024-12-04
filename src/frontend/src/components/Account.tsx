import React, { useState } from "react";
import "./Account.css";

const Account: React.FC = () => {

  const initialState = {
    profilePic: null,
    bannerPic: null,
    name: "Syuhada",
    email: "syuhada@gmail",
    username: "syushou",
    password: "",
  };

  const [profilePic, setProfilePic] = useState<string | null>(initialState.profilePic);
  const [bannerPic, setBannerPic] = useState<string | null>(initialState.bannerPic);
  const [name, setName] = useState(initialState.name);
  const [email, setEmail] = useState(initialState.email);
  const [username, setUsername] = useState(initialState.username);
  const [password, setPassword] = useState(initialState.password);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "profile") setProfilePic(reader.result as string);
        if (type === "banner") setBannerPic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setProfilePic(initialState.profilePic);
    setBannerPic(initialState.bannerPic);
    setName(initialState.name);
    setEmail(initialState.email);
    setUsername(initialState.username);
    setPassword(initialState.password);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Profile updated:", { profilePic, bannerPic, name, email, username, password });
    alert("Profile updated successfully!");
  };

  return (
    <div>
      <h1>Account Settings</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Banner Picture</label>
          <div className="image-preview">
            {bannerPic ? <img src={bannerPic} alt="Banner" /> : <div className="placeholder">No banner uploaded</div>}
          </div>
          <input type="file" onChange={(e) => handleImageUpload(e, "banner")} accept="image/*" />
        </div>

        <div className="form-group">
          <label>Profile Picture</label>
          <div className="image-preview">
            {profilePic ? <img src={profilePic} alt="Profile" /> : <div className="placeholder">No profile picture</div>}
          </div>
          <input type="file" onChange={(e) => handleImageUpload(e, "profile")} accept="image/*" />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Change Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New Password"
          />
        </div>

        <div className="button-group">
          <button type="button" onClick={handleClear} className="clear-button">Clear</button>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Account;
