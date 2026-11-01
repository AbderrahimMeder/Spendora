'use client';
import { useState } from "react";
import { UserIcon, Mail, Smartphone, Sparkles, Loader2 } from "lucide-react";
import { User } from "@/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function SettingProfiles({ user }: { user: User | null; token?: string | null | undefined }) {
  const router = useRouter();
  const { t } = useTranslation();
  const [UserProfile, setUserPorfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    country: user?.country ?? '',
    bio: user?.bio ?? '',
    hasSubscription: user?.hasSubscription ?? false,
  });
  const [loading, setloading] = useState<boolean>(false);
  const CanUserChangeProfile =
    (user?.email ?? '') !== UserProfile.email.trim() ||
    (user?.name ?? '') !== UserProfile.name.trim() ||
    (user?.phone ?? '') !== UserProfile.phone.trim() ||
    (user?.country ?? '') !== UserProfile.country.trim() ||
    (user?.bio ?? '') !== UserProfile.bio.trim();

  const validation = (): string | null => {
    if (!CanUserChangeProfile) {
      return t('settings_page.profile.validation.cannot_edit');
    }
    if (!UserProfile.name.trim()) {
      return t('settings_page.profile.validation.name_required');
    }

    if (!UserProfile.email.trim()) {
      return t('settings_page.profile.validation.email_required');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(UserProfile.email.trim())) {
      return t('settings_page.profile.validation.email_invalid');
    }

    if (!UserProfile.phone.trim()) {
      return t('settings_page.profile.validation.phone_required');
    }

    if (!UserProfile.country.trim()) {
      return t('settings_page.profile.validation.country_required');
    }
    return null;
  };

  const StyleForSaveButton = CanUserChangeProfile && !loading
    ? "var(--accent-primary)"
    : "rgba(16, 185, 129, 0.15)";

  const SaveUserProfileChange = async () => {
    setloading(true);
    const validationError = validation();
    if (validationError) {
      toast.error(validationError);
      setloading(false);
      return;
    }
    try {
      const res = await fetch("/api/Profile/Information", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: UserProfile.name.trim(),
          email: UserProfile.email.trim(),
          phone: UserProfile.phone.trim(),
          country: UserProfile.country.trim(),
          bio: UserProfile.bio.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || t('settings_page.profile.validation.update_failed'));
        return;
      }
      if (data.status === 200) {
        toast.success(data.message);
        router.refresh();
      }
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : t('settings_page.profile.validation.something_wrong')
      );
    }
    setloading(false);
  };

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
              {t('settings_page.profile.personal_info')}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
              {t('settings_page.profile.personal_info_desc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {t('settings_page.profile.full_name')}
            </label>
            <input
              type="text"
              value={UserProfile.name}
              onChange={(e) => {
                setUserPorfile((prev) => ({ ...prev, name: e.target.value }));
              }}
              placeholder={t('settings_page.profile.full_name_placeholder')}
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
              {t('settings_page.profile.email')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={UserProfile.email}
                onChange={(e) => {
                  setUserPorfile((prev) => ({ ...prev, email: e.target.value }));
                }}
                placeholder={t('settings_page.profile.email_placeholder')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  paddingInlineStart: '2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                className="focus:border-emerald-500 transition-colors"
              />
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', insetInlineStart: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {t('settings_page.profile.phone')}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                value={UserProfile.phone}
                onChange={(e) => {
                  setUserPorfile((prev) => ({ ...prev, phone: e.target.value }));
                }}
                placeholder={t('settings_page.profile.phone_placeholder')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  paddingInlineStart: '2.2rem',
                  borderRadius: 'var(--radius-md)',
                  background: '#161616',
                  border: '1px solid var(--border-subtle)',
                  color: '#ffffff',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
                className="focus:border-emerald-500 transition-colors"
              />
              <Smartphone size={15} color="var(--text-muted)" style={{ position: 'absolute', insetInlineStart: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              {t('settings_page.profile.country')}
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
              {t('settings_page.profile.bio')}
            </label>
            <textarea
              rows={3}
              value={UserProfile.bio}
              onChange={(e) => {
                setUserPorfile((prev) => ({ ...prev, bio: e.target.value }));
              }}
              placeholder={t('settings_page.profile.bio_placeholder')}
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
            disabled={!CanUserChangeProfile || loading}
            onClick={() => {
              SaveUserProfileChange();
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
              cursor: CanUserChangeProfile && !loading ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? (
              <span className="flex justify-center items-center gap-2">
                {t('settings_page.profile.saving')}<Loader2 className="h-4 w-4 animate-spin" />
              </span>
            ) : (
              t('settings_page.profile.save_changes')
            )}
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
              <div style={{
                fontSize: '0.75rem',
                color: `${UserProfile.hasSubscription ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em'
              }}>
                {UserProfile.hasSubscription ? t('settings_page.profile.tier.active_plan') : t('settings_page.profile.tier.inactive_plan')}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', margin: '0.2rem 0' }}>
                {UserProfile.hasSubscription ? t('settings_page.profile.tier.plan_pro') : t('settings_page.profile.tier.plan_free')}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                {UserProfile.hasSubscription ? t('settings_page.profile.tier.pro_desc') : t('settings_page.profile.tier.free_desc')}
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
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('settings_page.profile.tier.billing_cycle')}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff' }}>
                {UserProfile.hasSubscription ? t('settings_page.profile.tier.yearly_price') : t('settings_page.profile.tier.free_price')}
              </div>
            </div>
            <div style={{ background: '#161616', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('settings_page.profile.tier.next_renewal')}</div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#10b981' }}>
                {UserProfile.hasSubscription ? 'Oct 15, 2027' : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
