import axios from 'axios';

const apiUrl = 'https://vbago.science/api';
// const apiUrl = 'http://localhost:3131';

const searchSpecies = (query, discipline) => axios
  .get(`${apiUrl}/search`, {
    params: {
      query,
      discipline,
    },
  })
  .then(res => res.data)
  .catch(error => console.log(error.message));

export default searchSpecies;
