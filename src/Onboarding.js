import { useState } from 'react';

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const Onboarding = ({ onComplete }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const firstOk = firstName.trim().length > 0;
  const lastOk = lastName.trim().length > 0;
  const mailOk = emailOk(email);
  const valid = firstOk && lastOk && mailOk;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (valid) {
      onComplete({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() });
    }
  };

  return (
    <main>
      <section aria-label="onboarding" className="onboarding">
        <article aria-label="onboarding copy">
          <h2>Welcome to Little Lemon 🍋</h2>
          <p>Tell us who you are so we can personalize your experience.</p>
        </article>
        <form aria-label="onboarding form" className="onboarding-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="ob-firstname">First name</label>
          <input
            type="text" id="ob-firstname" name="firstName"
            placeholder="Enter your first name"
            value={firstName} onChange={(e) => setFirstName(e.target.value)}
          />
          {touched && !firstOk && <span className="form-error">First name is required.</span>}

          <label htmlFor="ob-lastname">Last name</label>
          <input
            type="text" id="ob-lastname" name="lastName"
            placeholder="Enter your last name"
            value={lastName} onChange={(e) => setLastName(e.target.value)}
          />
          {touched && !lastOk && <span className="form-error">Last name is required.</span>}

          <label htmlFor="ob-email">Email</label>
          <input
            type="email" id="ob-email" name="email"
            placeholder="Enter your email address"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          {touched && !mailOk && <span className="form-error">Enter a valid email address.</span>}

          <button type="submit" id="ob-submit" disabled={!valid}>Continue</button>
        </form>
      </section>
    </main>
  );
};

export default Onboarding;
