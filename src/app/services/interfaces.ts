export interface UserReturn {
    id: string
    role: string
    username: string
    iat: number
    exp: number
  }


  export interface HealthMetric {
    type: string
    value: number
  }
  

   export interface User {
    username: string
    email: string
    password: string
  }

  export interface SuccessLogin {
    message: string
    token: string
  }
  
  export interface MatricsReturn {
    _id: string
    user: User
    type: string
    value: number
    createdAt: Date
    updatedAt: Date
    __v: number
  }

  export interface GroupedMetric {
    type: string;
    matchedDatas: MatricsReturn[];
  }


  export interface IRequest {
    url: string
    body: unknown
    headers: Headers
    context: unknown
    reportProgress: boolean
    withCredentials: boolean
    responseType: string
    method: string
    params: unknown
    urlWithParams: string
  }
  
  