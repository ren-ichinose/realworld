export default interface UserResponse {
  username: string;

  email: string;

  token: string | null;

  bio: string | null;

  image: string | null;
}
