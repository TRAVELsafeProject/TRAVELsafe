

const where = encodeURIComponent(JSON.stringify({
  "country": {
    "__type": "Pointer",
    "className": "Country",
    "objectId": "5Vs8zprtNC"
  }}))

const getCityList = () => {
      
      axios.get(`https://parseapi.back4app.com/classes/Continentscountriescities_Subdivisions_States_Provinces?limit=200&order=name&where=${where}`, {
        headers: 
        {
          'X-Parse-Application-Id': '8lFUxW5GUgxhP7mgC767mDx8bt8yUm8iZYXMxziq',
          'X-Parse-REST-API-Key': 'rmUiExtQ0rJjOwm825bGnuBN1SfxZZjmirTmyIDv'
        }
      })
        .then((result) => {
          const cities = result.data.results
          let capitals = []
          cities.forEach(city => {
            const option = document.getElementById('cities-full-list')
            const capital = document.createElement('option')
            const capitalText = document.createTextNode(`${city.Subdivision_Name}`)

            capital.appendChild(capitalText)
            option.appendChild(capital)

            // capital.textContent = `${city.Subdivision_Name}`
            // option.appendChild(capital)
            
            // capital.innerHTML = `${city.Subdivision_Name}`
            // select.appendChild(capital)
            // capitals.push(city.Subdivision_Name)
          });
          // let sortedCapitals = capitals.sort()
          // console.log(capitals)

          // sortedCapitals.forEach(capital => {
          //   const city = document.createElement('option')
          //   city.innerText = capital
          //   document.getElementById('cities-full-list').append(city)
          // });
            // HAY QUE TERMINAR DE ARREGLAR LAS CIUDADES (TILDES)
        })
        .catch((err) => {
          console.log(err)
        })
  
}
getCityList() 

document.addEventListener('DOMContentLoaded', () => {

  

}, false);


