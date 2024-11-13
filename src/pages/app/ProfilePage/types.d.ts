export type userData = {
  name?: string;
  username?: string;
  email: string;
  profile_pic?: string | Blob | File;
};

export type userPasswordData = {
  OTP: string;
  newPassword: string;
  confirmPassword: string;
};

export type socialsType = {
  email: string;
  phone: string;
  facebook: string;
  linkedin: string;
  twitter: string;
  whatsapp: string;
  instagram: string;
};
