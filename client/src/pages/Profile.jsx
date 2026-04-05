import { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { User, Mail, Calendar, Settings } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Fetch real profile
        const res = await userService.getProfile();
        setProfile(res.data);
        setEditName(res.data.username);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profile) {
    return <div style={{ textAlign: 'center', padding: '4rem' }}>Loading profile...</div>;
  }

  return (
    <div className="profile-page" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="page-header">
        <h1>Your Profile</h1>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
          <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={50} />
          </div>
          <div>
            {isEditing ? (
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                style={{
                  fontSize: '1.5rem', padding: '0.5rem', marginBottom: '0.5rem',
                  backgroundColor: 'var(--color-bg-elevated)', color: 'white',
                  border: '1px solid var(--color-primary)', borderRadius: '0.25rem'
                }}
              />
            ) : (
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{profile.username}</h2>
            )}
            <p style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} /> {profile.email}
            </p>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Settings size={20} color="var(--color-primary)" /> Account Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', backgroundColor: 'var(--color-bg-elevated)', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Member Since</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={16} /> {new Date(profile.joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Account Type</p>
              <p>Premium Reader</p>
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          {isEditing ? (
            <>
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '0.75rem 2rem', backgroundColor: 'var(--color-primary)' }}
                onClick={async () => {
                  try {
                    const res = await userService.updateProfile({ username: editName });
                    setProfile(res.data);
                    setIsEditing(false);
                  } catch (err) {
                    console.error("Failed to update profile", err);
                  }
                }}
              >
                Save Changes
              </button>
              <button 
                className="btn-primary" 
                style={{ width: 'auto', padding: '0.75rem 2rem', backgroundColor: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)' }}
                onClick={() => {
                  setEditName(profile.username);
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <button 
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.75rem 2rem' }}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;