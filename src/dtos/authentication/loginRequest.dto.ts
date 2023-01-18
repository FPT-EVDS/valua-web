interface LoginRequestDto {
  email: string;
  password: string;
  signature: string | null;
}

export default LoginRequestDto;
