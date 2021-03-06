

const getCityList = () => {
  router.get('/axios', (req, res, next) => {
    const where = encodeURIComponent(JSON.stringify({
      "country": {
        "__type": "Pointer",
        "className": "Country",
        "objectId": "5Vs8zprtNC"
      }}))
      
      axios.get(`https://parseapi.back4app.com/classes/Continentscountriescities_Subdivisions_States_Provinces?limit=200&order=name&where=${where}`, {
        headers: 
        {
          'X-Parse-Application-Id': '8lFUxW5GUgxhP7mgC767mDx8bt8yUm8iZYXMxziq',
          'X-Parse-REST-API-Key': 'rmUiExtQ0rJjOwm825bGnuBN1SfxZZjmirTmyIDv'
        }
      })
        .then((result) => {
          const cities = result.data.results
          const capitals = []
          cities.forEach(city => {
            capitals.push(city.Subdivision_Name)
          });
          const sortedCapitals = capitals.sort()
          sortedCapitals.forEach(capital => {
            const city = document.createElement('option')
            city.innerText = capital
            document.getElementById('cities-full-list').append(city)
          });
            // HAY QUE TERMINAR DE ARREGLAR LAS CIUDADES (TILDES)
        })
        .catch((err) => (err))
  })
}

document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

  getCityList()  

}, false);

