declare global {
  type VersionType = {
    filename: string
    filesize: string
    md5: string
    urls: {
      cdn: string | null
      local: string | null
    }
  }

  type VersionWrapperType = {
    [key: string]: VersionType
  }

  type VersionsType = {
    [key: string]: VersionWrapperType
  }

  type OptionalExceptFor<T, TRequired extends keyof T = keyof T> = Partial<Pick<T, Exclude<keyof T, TRequired>>> & Required<Pick<T, TRequired>>
}

export {}
