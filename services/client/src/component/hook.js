import { useState, useEffect } from "react";

import { getAllLang, getMyLangs } from "../api";

export const useSelLang = () => {
  const [selLang, setSelLang] = useState({
    user_offer_langs: [
      {
        lang_name: "English",
        level: 1,
      },
    ],
    user_acpt_langs: [
      {
        lang_name: "Chinese",
        level: 1,
      },
    ],
  });

  const [allLang, setAllLang] = useState([]);

  const selectLevelHandler = ({ type, index, level }) => {
    if (type === "acpt") {
      setSelLang((prev) => {
        //  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
        const update = prev.user_acpt_langs;

        update[index] = {
          lang_name: update[index]?.lang_name,
          level,
        };

        return {
          ...prev,
          user_acpt_langs: update,
        };
      });
    } else {
      setSelLang((prev) => {
        const update = prev.user_offer_langs;

        update[index] = {
          lang_name: update[index]?.lang_name,
          level,
        };

        return {
          ...prev,
          user_offer_langs: update,
        };
      });
    }
  };

  const selectLangHandler = ({ type, index, name, idx }) => {
    if (type === "acpt") {
      setSelLang((prev) => {
        const update = prev.user_acpt_langs;
        update[index] = {
          lang_name: idx === 0 ? false : name,
          level: update[index]?.level,
        };

        return {
          ...prev,
          user_acpt_langs: update,
        };
      });
    } else {
      setSelLang((prev) => {
        const update = prev.user_offer_langs;

        update[index] = {
          lang_name: idx === 0 ? false : name,
          level: update[index]?.level,
        };

        return {
          ...prev,
          user_offer_langs: update,
        };
      });
    }
  };

  useEffect(() => {
    getAllLang()
      .then((res) => {
        setAllLang(res.data);
      })
      .catch((error) => {
        console.error(error);
      });

    getMyLangs()
      .then((res) => {
        setSelLang(res.data.langs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return { allLang, selectLevelHandler, selectLangHandler, selLang };
};
