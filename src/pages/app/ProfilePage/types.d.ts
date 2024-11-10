export type userData = {
  name?: string;
  email: string;
  profile_pic?: string | Blob | File;
};

export type userPasswordData = {
  OTP: string;
  newPassword: string;
  confirmPassword: string;
};
