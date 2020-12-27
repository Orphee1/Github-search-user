import React, { useContext } from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const chartData = [
    {
      label: "HTML",
      value: "13",
    },
    {
      label: "CSS",
      value: "160",
    },
    {
      label: "Javascript",
      value: "80",
    },
  ];
  const { repos } = useContext(GithubContext);
  // console.log(repos);

  // To get languages instances number in all the repos
  const languages = repos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    if (!language) return total; // to skip cases when langage = null
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      };
    }
    return total;
  }, {});
  // console.log(languages);
  // to get only the 5 most used languages by a user
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  // most stars per languages

  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      // Doughnut chart requires a value key. To override it.
      return { ...item, value: item.stars };
    });
  // console.log(mostPopular);

  // stars, forks
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { name, stargazers_count, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />

        <Column3D
          data={stars}
          // data={chartData}
        />
        <Doughnut2D
          data={mostPopular}
          // data={chartData}
        />
        <Bar3D
          data={forks}
          // data={chartData}
        />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
