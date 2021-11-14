import React, { useState, useEffect } from "react";

import { getAllLang, getMyLangs } from "../api";

export const useSelLang = () => {

    const [selLang, setSelLang] = useState({
		user_offer_lang: [
			{
				lang_name: "Chinese",
				level: 3
			},
			{
				lang_name: "Swedish",
				level: 6
			},
			{
				lang_name: "Danish",
				level: 6
			}
		],
		user_acpt_lang: [
			{
				lang_name: "Chinese",
				level: 3
			},
			{
				lang_name: "Swedish",
				level: 3
			},
			{
				lang_name: "Arabic",
				level: 3
			}
		],
		username: "",
		password: "",
		email: "",
        pic: null,
        bio:""
	});

    const [allLang, setAllLang] = useState([]);

    const selectLevelHandler = ({ type, index, level }) => {
        if (type === "acpt") {
            setSelLang(prev => {
                //  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
                const update = prev.user_acpt_lang;
    
                update[index] = {
                    lang_name: update[index].lang_name,
                    level
                };
    
                return {
                    ...prev,
                    user_acpt_lang: update
                };
            });
        } else {
            setSelLang(prev => {
                const update = prev.user_offer_lang;
    
                update[index] = {
                    lang_name: update[index].lang_name,
                    level
                };
    
                return {
                    ...prev,
                    user_offer_lang: update
                };
            });
        }
    };
    
    const selectLangHandler = ({ type, index, name }) => {
      if (type === "acpt") {
        setSelLang((prev) => {
          //  保留acpt_lang的其餘屬性，只改變acpt_lang[1].level
          const update = prev.user_acpt_lang;

          update[index] = {
            lang_name: name,
            level: update[index].level,
          };

          return {
            ...prev,
            user_acpt_lang: update,
          };
        });
      } else {
        setSelLang((prev) => {
          const update = prev.user_offer_lang;

          update[index] = {
            lang_name: name,
            level: update[index].level,
          };

          return {
            ...prev,
            user_offer_lang: update,
          };
        });
      }
    };
    
    useEffect(() => {
        getAllLang().then((res) => {
            setAllLang(res.data);
        })
        .catch((error) => {
            console.error(error);
        });

        getMyLangs().then((res) => {
            setSelLang(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return { allLang, selectLevelHandler, selectLangHandler, selLang }
}



