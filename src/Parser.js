/**
 * @name: WebScraper
 * @author: Hannes Kasel
 * @version: 0.2
 * @date 22-07-20
 * @brief du könntesch z.B. https://www.innsbrucktermine.at/?search=&category=&daterange=2022-07-15+-+2022-07-15 parsen
 * mit axios das html abholen und in a variable schreiben
 * mit cheerio dann den html string parsen
 * aus dem cheerio objekt dann die html teile die relevant sind rausholen
 * und in a json objekt schreiben
 */

// importing filesystem
const fs = require('fs')
//importing Axios
const axios = require('axios')
//importing Cheerio
const cheerio = require ('cheerio')
//const { children } = require('cheerio/lib/api/traversing');


//Übergabe Zeitraum
let startDate = "2022-11-25"
let endDate = "2022-11-25"
//2022-11-24+-+2022-11-24
/**
 * Main Entry Point
 */


// asynchronous call of the URL 

  const fetchResponse = async() => {
      try
      {
        //url Abfrage dynamisch machen
          //hier bietet sich natürlich ein string mit variabler datumsabfrage ...=${datumStart}+-+${datumEnde}#event-list an'
          const {data} = await axios.get(`https://www.innsbrucktermine.at/?search=&category=&daterange=${startDate}+-+${endDate}#event-list`);
          
          const $ = cheerio.load(data)
          
          const eventList = $(".card__content")
          const eventDate = $(".card__date")

          const eventItem = []
          
          eventList.each((index,el) => {
            const EVENT = {Index:'',Veranstaltung:'', Ort: '', Datum: ''}
            
            EVENT.Index = index
            EVENT.Veranstaltung = $(el).children(".card__text").children("h3").text()
            EVENT.Ort = $(el).children(".card__text").children("p").text()
      
            eventItem.push(EVENT)
          })
          
          // eventList.each((index, el) => {
          //   const EVENT = { Index: '', Veranstaltung: '', Ort: '', Datum: ''}

          //   EVENT.Index = index
          //   EVENT.Veranstaltung = $(el).children("h3").text()
          //   EVENT.Ort = $(el).children("p").text()

          //   eventItem.push(EVENT)
          // })

          eventDate.each((_index, el) => {
           
            const EVENT = eventItem[_index]
              EVENT.Datum = $(el).children("time").text()
          })
          
          //inline call to check the fetched elements in console
          //console.dir(eventItem)
          
          fs.writeFile('events.json', JSON.stringify(eventItem, null, 2),(error) =>
          {
            if (error){
              console.log(error)
              return
            }
            console.log('Website data has been scraped.')
          })
      }
      catch (error)
      {
        console.error(error);
      }
  }

  fetchResponse();


