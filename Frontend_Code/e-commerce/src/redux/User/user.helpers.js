import { auth } from "./../../firebase/utils";

export const handleResetPasswordAPI = (email) => {
  return new Promise((resolve, reject) => {
    const config = {
      url: "http://localhost:3000/login",
    };
    auth
      .sendPasswordResetEmail(email, config)
      .then(() => {
        resolve();
      })
      .catch(() => {
        const err = ["Email not found. Please try again"];
        reject(err);
      });
  });
};
