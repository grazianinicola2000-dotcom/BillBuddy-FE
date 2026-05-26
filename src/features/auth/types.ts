export interface LoginRequestDTO {
  email: string
  password: string
}

export interface UserDTO {
  userId: string
  username: string
  email: string
}

export interface LoginResponseDTO {
  token: string
}
