import axios from "axios";
import { useCallback } from "react"
import { HOST } from "../constants.js";

export const useSubmit = (year: string, day: string, part: string, answer: string): () => Promise<any> => {
  const submit = useCallback<() => Promise<any>>(() => {
    const url = `${HOST}/${year}/day/${day}/answer`;
    const data = `level=${part}&answer=${answer}`;
    return new Promise((resolve, reject) => {
      const SESSION = process.env['SESSION']
      if (!SESSION) {
        return reject('Invalid SESSION')
      }
      axios({
        method: 'POST',
        url,
        data,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          cookie: `session=${SESSION};`
        }
      }).then(resp => {
        let matches = resp.data.match(/(That's (not )?the right answer)/);
        if (matches) {
          if (matches[1] === 'That\'s the right answer') {
            return resolve({ correct: true });
          } else {
            const waitingTime = resp.data.match(/please wait (.*) before/);
            if (waitingTime) {
              return resolve({ correct: false, waitingTime: waitingTime[1] });
            } else {
              return resolve({ correct: false });
            }
          }
        }
        matches = resp.data.match(/You have (.*) left to wait/);
        if (matches) {
          return resolve({ correct: false, waitingTime: matches[1] })
        }
        return reject('Unknown response');
      }).catch(err => {
        return reject(err);
      });
    })
  }, [year, day, part, answer]);
  return submit
}