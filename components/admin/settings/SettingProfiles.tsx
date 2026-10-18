'use client'
import { useState } from "react";
import { UserIcon, Mail, Smartphone, Sparkles } from "lucide-react";
import { User } from "@/types";
import { toast } from "sonner";
export default function SettingProfiles({ user , token }: { user: User | null, token: string|null|undefined }) {
  const [UserProfile, setUserPorfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    country: user?.country ?? '',
    bio: user?.bio ?? '',
    hasSubscription: user?.hasSubscription ?? false,
  })
  const CanUserChangeProfile =
    (user?.email ?? '') !== UserProfile.email ||
    (user?.name ?? '') !== UserProfile.name ||
    (user?.phone ?? '') !== UserProfile.phone ||
    (user?.country ?? '') !== UserProfile.country ||
    (user?.bio ?? '') !== UserProfile.bio;
  const StyleForSaveButton = CanUserChangeProfile ? 'var(--accent-primary)' : 'rgba(16, 185, 129, 0.15)'
  const SaveUserProfileChange = async () => {
    try{
        if (!CanUserChangeProfile) return null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/api/update-profile/${user?.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: UserProfile.name,
            email: UserProfile.email,
            phone: UserProfile.phone,
            country: UserProfile.country,
            bio: UserProfile.bio,
          })
        })
        if(!res.ok){
          toast.error('Failed to update profile');
          return;
        }
        const data= await res.json();
        if(data.status==201){
          toast.success(data.message);
        }
    }
    catch(error:any){
      toast.error('Internal server Error');
    }
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {/* Personal Details Card */}
      <div
        style={{
          background: '#111111',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
            }}
          >
            <UserIcon size={17} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Personal Information
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              Update your contact details and display credentials
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Full  Name
            </label>
            <input
              type="text"
              value={UserProfile.name}
              onChange={(e) => {
                setUserPorfile((prev) => ({ ...prev, name: e.target.value }));
              }}
              placeholder="e.g. Alex Morgan"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: '#161616',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
              }}
              className="focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={UserProfile.email}
                onChange={(e) => {
                  setUserPorfile((prev) => ({ ...prev, email: e.target.value }));
                }}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  paddingLeft: '2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                className="focus:border-emerald-500 transition-colors"
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Phone Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={UserProfile.phone}
                onChange={(e) => {
                  setUserPorfile((prev) => ({ ...prev, phone: e.target.value }));
                }}
                placeholder="+1 (555) 000-0000"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  paddingLeft: '2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                className="focus:border-emerald-500 transition-colors"
              />
              <Smartphone size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Country / Region
            </label>
            <select
              value={UserProfile.country}
              onChange={(e) => {
                setUserPorfile((prev) => ({ ...prev, country: e.target.value }));
              }}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: '#161616',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
              className="focus:border-emerald-500 transition-colors"
            >
              <option value="United States">United States (US)</option>
              <option value="Morocco">Morocco (MA)</option>
              <option value="France">France (FR)</option>
              <option value="United Kingdom">United Kingdom (UK)</option>
              <option value="Germany">Germany (DE)</option>
              <option value="Canada">Canada (CA)</option>
              <option value="Spain">Spain (ES)</option>
              <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Financial Bio & Wealth Goal
            </label>
            <textarea
              rows={3}
              value={UserProfile.bio}
              onChange={(e) => {
                setUserPorfile((prev) => ({ ...prev, bio: e.target.value }));
              }}
              placeholder="Tell us about your financial philosophy or targets..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: '#161616',
                border: '1px solid var(--border-subtle)',
                color: '#ffffff',
                fontSize: '0.85rem',
                outline: 'none',
                resize: 'vertical',
              }}
              className="focus:border-emerald-500 transition-colors"
            />
          </div>
          <button
            type="button"
            disabled={!CanUserChangeProfile}
            onClick={() => {
              SaveUserProfileChange()
            }}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: 'var(--radius-md)',
              background: StyleForSaveButton,
              border: 'none',
              color: '#000000',
              fontSize: '0.85rem',
              fontWeight: '700',
              cursor: CanUserChangeProfile ? 'pointer' : 'not-allowed',
            }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Account Tier & Profile Media Card */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {/* Membership Tier Banner */}
        <div
          style={{
            background: `${UserProfile.hasSubscription ? `linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, #111111 100%)` : 'var(--background-secondary)'}`,
            border: UserProfile.hasSubscription ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #161616',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', 
                color: `${UserProfile.hasSubscription ? 'var(--accent-primary)' : 'var(--text-muted)'}`, 
                fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {UserProfile.hasSubscription ? 'Active Plan' : 'Inactive Plan'} 
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                {UserProfile.hasSubscription ? 'Spendora PRO Enterprise' : 'Spendora Free'}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                {UserProfile.hasSubscription ? 'Unlimited multi-currency accounts, automated bank synchronization, AI financial advisor.' : 'Basic features with limited access.'}
              </p>
            </div>
            <div
              style={{
                background: 'var(--accent-primary)',
                color: '#000000',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
              }}
            >
              <Sparkles size={18} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem' }}>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Billing Cycle</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>{UserProfile.hasSubscription ? 'Yearly ($99/yr)' : 'Free'}</div>
            </div>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Next Renewal</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>{UserProfile.hasSubscription ? 'Oct 15, 2027' : '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}