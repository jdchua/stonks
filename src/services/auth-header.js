export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));
  
    // check if user is logged in with accessToken
    if (user && user.accessToken) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }