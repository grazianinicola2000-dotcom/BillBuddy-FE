export interface LoginRequestDTO {
  email: string
  password: string
}

export interface UserDTO {
  userId: string
  username: string
  email: string
  avatarUrl: string
}

export interface LoginResponseDTO {
  token: string
}

export interface RegisterRequestDTO {
  name: string
  surname: string
  username: string
  email: string
  password: string
  dateOfBirth: string
}
