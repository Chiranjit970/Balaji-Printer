export type RootStackParamList = {
  index: undefined;
  '(auth)': undefined;
  '(tabs)': undefined;
};

export type AuthStackParamList = {
  login: undefined;
  'verify-otp': { phone: string };
};

export type TabsParamList = {
  print: undefined;
  store: undefined;
  orders: undefined;
  profile: undefined;
};
