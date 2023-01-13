declare module 'next-auth' {
    interface User {
        id: string
        name: string 
        avatar_url: string
        username: string
        email: string
    }


  interface Session {
    user: User
  }
}

