

export const isEmailValid = (email) => {
  if (!email) return { isValid: false, message: "Por favor, preencha o campo E-mail." };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return { isValid: false, message: "Por favor, insira um email válido." };
  return { isValid: true };
};


export const isLoginPasswordValid = (password) => {
  if (!password) return { isValid: false, message: "Por favor, preencha o campo Senha." };
  if (password.length < 8) return { isValid: false, message: "A senha deve ter no mínimo 8 caracteres." };
  return { isValid: true };
};

export const validatePassword = (password) => {
  const rules = {
    minLength: password.length >= 8,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    specialChar: /[@$!%*?&]/.test(password),
  };
  const isValid = Object.values(rules).every(Boolean);
  return { isValid, rules };
};