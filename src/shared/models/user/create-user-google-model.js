export const createUserGoogleModel = (user) => ({
  auth_id: user.uid,
  email: user.providerData[0].email,
  profile_picture: user.photoURL,
});
