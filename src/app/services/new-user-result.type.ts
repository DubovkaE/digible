export type NewUserResult = {
  email: string,
  wallet_address?: string,
  username: string,
  twitter: string,
  instagram: string,
  twitch: string,
  digisafe_variants: number[],
  facility: string,
  status: 'error' | 'success'
};
