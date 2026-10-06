import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, onSave, onLogout }) => {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [email, setEmail] = useState(user.email || '');
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault();
    onSave({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/', { replace: true });
  };

  return (
    <main>
      <section aria-label="profile" className="profile">
        <article aria-label="profile copy">
          <h2>Your Profile</h2>
          <p>These details were saved during onboarding. You can update them below.</p>
        </article>
        <form aria-label="profile form" className="profile-form" onSubmit={handleSave}>
          <label htmlFor="pf-firstname">First name</label>
          <input
            type="text" id="pf-firstname" name="firstName"
            value={firstName} onChange={(e) => setFirstName(e.target.value)} required
          />
          <label htmlFor="pf-lastname">Last name</label>
          <input
            type="text" id="pf-lastname" name="lastName"
            value={lastName} onChange={(e) => setLastName(e.target.value)} required
          />
          <label htmlFor="pf-email">Email</label>
          <input
            type="email" id="pf-email" name="email"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <div className="profile-actions">
            <button type="submit" id="pf-save">Save changes</button>
            <button type="button" id="pf-logout" className="btn-secondary" onClick={handleLogout}>Log out</button>
          </div>
          {saved && <span className="form-success">Profile updated ✓</span>}
        </form>
      </section>
    </main>
  );
};

export default Profile;
