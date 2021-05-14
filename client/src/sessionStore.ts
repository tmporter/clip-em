export const getSession = () => {
  const session = localStorage.getItem("session");

  if (session) {
    return JSON.parse(session);
  } else {
    return undefined;
  }
};

export const setSession = (session: any) => {
  localStorage.setItem("session", JSON.stringify(session));
};
