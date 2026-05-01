export type AdminBranding = {
  storeName: string;
  storeTagline: string;
  primaryColor: string;
};

const STORAGE_KEY = 'adminBranding';

export const defaultAdminBranding: AdminBranding = {
  storeName: 'ANIX',
  storeTagline: 'Luxury Watch Emporium',
  primaryColor: '#000000',
};

const isValidHexColor = (value: string) => /^#([0-9a-fA-F]{6})$/.test(value);

export const normalizeBranding = (value?: Partial<AdminBranding> | null): AdminBranding => {
  const storeName = value?.storeName?.trim() || defaultAdminBranding.storeName;
  const storeTagline = value?.storeTagline?.trim() || defaultAdminBranding.storeTagline;
  const rawColor = value?.primaryColor?.trim() || defaultAdminBranding.primaryColor;
  const primaryColor = isValidHexColor(rawColor) ? rawColor : defaultAdminBranding.primaryColor;

  return {
    storeName,
    storeTagline,
    primaryColor,
  };
};

export const getAdminBranding = (): AdminBranding => {
  if (typeof window === 'undefined') return defaultAdminBranding;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultAdminBranding;
    return normalizeBranding(JSON.parse(raw));
  } catch {
    return defaultAdminBranding;
  }
};

export const saveAdminBranding = (branding: AdminBranding) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeBranding(branding)));
  window.dispatchEvent(new Event('admin-branding-updated'));
};
