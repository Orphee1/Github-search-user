import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import mockFollowing from "./mockData.js/mockFollowing";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [following, setFollowing] = useState(mockFollowing);

  // request loading
  const [requests, setRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({ show: false, msg: "" });
  //              ES6 default values in arguments
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  const searchGithubUser = async (user) => {
    setIsLoading(true);
    toggleError();
    //             axios has a get request by default
    const response = await axios(`${rootUrl}/users/${user}`).catch((error) =>
      console.log(error)
    );
    // console.log(response);
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      // console.log(response.data);

      // to get repos and following
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${rootUrl}/users/${login}/following?per_page=100`),
      ])
        .then((result) => {
          console.log(result);
          const [repos, following] = result;
          const status = "fulfilled";
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (following.status === status) {
            setFollowing(following.value.data);
          }
        })
        .catch((error) => console.log(error));
    } else {
      toggleError(true, "there is no user with that username");
    }
    checkRequest();
    setIsLoading(false);
  };

  const checkRequest = () => {
    // axios has a get request by default
    axios(` ${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequests(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry, you have exeeded your hourly rate limit!");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(checkRequest, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        following,
        requests,
        error,
        isLoading,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
