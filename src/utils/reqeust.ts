class Request {
  url: URL;
  constructor(url: string) {
    this.url = new URL(url);
  }

  buildNewUrl(path: string): URL {
    return new URL(this.url + path.slice(1));
  }

  get<T>(path: string) {
    const getUrl = this.buildNewUrl(path);
    return new Promise((res: (value: T) => void, rej: (reason: Error) => void): void => {
      fetch(getUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer a`,
        },
      })
        .then((fetchRes) => fetchRes.json())
        .then((data: T) => {
          res(data);
        })
        .catch((err: Error) => {
          rej(err);
        });
    });
  }

  post<T, U extends object>(path: string, body: U) {
    const postUrl = this.buildNewUrl(path);
    return new Promise((res: (value: T) => void, rej: (reason: Error) => void): void => {
      fetch(postUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer a`,
        },
        body: JSON.stringify(body),
      })
        .then((fetchRes) => fetchRes.json())
        .then((data: T) => {
          res(data);
        })
        .catch((err: Error) => {
          rej(err);
        });
    });
  }
}

const SERVICE_URL = "https://map.archivemodel.cn";
export const request = new Request(SERVICE_URL);
