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
          
          const capitals = []
          cities.forEach(city => {
            capitals.push(city.Subdivision_Name)
          });

          const capitalsFixed = [...capitals]

          for(let i = 0; i < capitalsFixed.length; i++) {
            capitalsFixed[i] = capitalsFixed[i].replace("_", "é");
            capitalsFixed[i] = capitalsFixed[i].replace("Biskaia", "Bilbo");
            capitalsFixed[i] = capitalsFixed[i].replace("La Rioja", "Logroño");
            capitalsFixed[i] = capitalsFixed[i].replace("Gipuzkoa", "Donosti");
            capitalsFixed[i] = capitalsFixed[i].replace("Las Palmas", "Las Palmas de Gran Canaria");
            capitalsFixed[i] = capitalsFixed[i].replace("Álava / Araba", "Gasteiz");
            capitalsFixed[i] = capitalsFixed[i].replace("Balears  [Baleares]", "Palma de Mallorca");
            capitalsFixed[i] = capitalsFixed[i].replace("Navarra / Nafarroa", "Pamplona");
            capitalsFixed[i] = capitalsFixed[i].replace("Alicante / Alacant", "Alacant");
            capitalsFixed[i] = capitalsFixed[i].replace("A Coruña  [La Coruña]", "A Coruña");
            capitalsFixed[i] = capitalsFixed[i].replace("Tarragona  [Tarragona]", "Tarragona");
            capitalsFixed[i] = capitalsFixed[i].replace("Castellón / Castelló", "Castelló");
            capitalsFixed[i] = capitalsFixed[i].replace("Valencia / València", "València");
            capitalsFixed[i] = capitalsFixed[i].replace("Lugo  [Lugo]", "Lugo");
            capitalsFixed[i] = capitalsFixed[i].replace("Barcelona  [Barcelona]", "Barcelona");
            capitalsFixed[i] = capitalsFixed[i].replace("Ourense  [Orense]", "Ourense");
            capitalsFixed[i] = capitalsFixed[i].replace("Girona  [Gerona]", "Girona");
            capitalsFixed[i] = capitalsFixed[i].replace("Pontevedra  [Pontevedra]", "Pontevedra");
            capitalsFixed[i] = capitalsFixed[i].replace("Lleida  [Lérida]", "Lleida");
          }

          const sortedCapitals = capitalsFixed.sort()

          sortedCapitals.forEach((city) => {

            const option = document.getElementById('cities-full-list')
            const capital = document.createElement('option')
            const capitalText = document.createTextNode(`${city}`)
            
            capital.appendChild(capitalText)
            option.appendChild(capital)
            
          });
        })
        .catch((err) => {
          console.log(err)
        }) 
}

const totalRating = () => {

    const totalRating = document.getElementById('total-rating')
    const commentsRating = document.getElementsByClassName('comment-rating')
    const commentsRatingFixed = [... commentsRating]
    let counter = 0
    
    commentsRatingFixed.forEach((rating)=>{
      
      counter += Number(rating.innerHTML)
    
    })

    totalRating.textContent = counter / commentsRatingFixed.length

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

}, false);

window.addEventListener('load', () => {
  totalRating()
})



