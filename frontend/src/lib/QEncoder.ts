type EncodableType = string | number | boolean

export class QEncoder {
  constructor(
    public searchParams: Record<string, EncodableType | Array<EncodableType>> = {}
  ) {}

  append(key: string, value: EncodableType | Array<EncodableType>) {
    this.searchParams[key] = value;
  }

  toString() {
    let queryString = ''
    for(const [key, value] of Object.entries(this.searchParams)) {
      if(Array.isArray(value)) {
        value.forEach(val => {
          queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(val)}`
        })
      } else {
        queryString += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      }
    }
    return queryString ? '?' + queryString.slice(1) : ''
  }
}