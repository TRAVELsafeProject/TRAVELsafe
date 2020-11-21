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

          

          cities.forEach((city) => {

            const option = document.getElementById('cities-full-list')
            const capital = document.createElement('option')
            const capitalText = document.createTextNode(`${city.Subdivision_Name}`)
            
            capital.appendChild(capitalText)
            option.appendChild(capital)
            
          });
        })
        .catch((err) => {
          console.log(err)
        }) 
}


// ELEMENTOS GUARDADOS DE DOM

      // BOTONES

const cityButton = document.getElementById("get-city-button")
const wishButton = document.getElementById("wish-button")

// ADD EVENT LISTENERS

document.addEventListener('DOMContentLoaded', () => {

  getCityList() 

  document.getElementById("get-city-button").onclick = () => {
    window.location = document.getElementById('cities-full-list').value
  }

  // wishButton.addEventListener("click", event => {
  //   wishButton.className = 'unclickable'
  // })

}, false);



