import { useEffect, useState } from "react"
import axios from 'axios';
import { HOST, VALID_YEARS } from "../constants.js";

const REGEX_USERNAME = /class="user">(.+?) ?</;
const REGEX_STAR = /class="star-count">(.+?)\*</;

export const useYearInfo = (year: string, ts: number): AppProfile => {
  const [userName, setUserName] = useState<string | undefined>('');
  const [star, setStar] = useState<string | undefined>('');
  useEffect(() => {
    const { SESSION } = process.env;
    if (!SESSION) {
      setUserName('')
      return
    }
    const url = VALID_YEARS.includes(year) ? `${HOST}/${year}` : `${HOST}`;
    axios({
      method: 'GET',
      url,
      headers: {
        cookie: `session=${SESSION};`
      }
    }).then(res => {
      if (res.data) {
        const matchUserName = REGEX_USERNAME.exec(res.data)
        if (matchUserName) {
          setUserName(matchUserName[1])
        }
        const matchStar = REGEX_STAR.exec(res.data)
        if (matchStar) {
          setStar(matchStar[1])
        }
      }
    });
  }, [year, ts])
  return { userName, star }
}