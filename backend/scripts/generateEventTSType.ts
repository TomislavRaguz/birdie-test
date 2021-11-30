import { env as _env } from '../src/enviroment'
import * as fs from 'fs'
import { camelCase, upperFirst } from 'lodash'
import { db } from '../src/singletons/knex'

const manualKeyTypeMap: Record<string, string> = {
  visit_count: 'number',
  consumed_volume_ml: 'number'
};

(async function () {
  const eventPayloads = await db('events').select("payload").then(rows => rows.map(row => JSON.parse(row.payload)))
  //console.log(eventPayloads) //5810 rows
  
  const { globalKeyOccurenceMap, typeKeyOccurenceFrequencyMap } = generateOccurenceMaps(eventPayloads);
  const baseKeys = getBaseKeys(globalKeyOccurenceMap, eventPayloads.length)
  console.log(baseKeys)
  let fileContent = 
`//Generated via script
interface BirdieBaseEvent {
  payload: string,
  ${baseKeys.map(key => `${key}: ${manualKeyTypeMap[key] || 'string'}`).join(`
  `)}
}`

  for (const [eventTypeKey, eventTypeOccurenceMap] of Object.entries(typeKeyOccurenceFrequencyMap)) {

    fileContent += 
`

interface ${pascalCase(eventTypeKey+"Event")} extends BirdieBaseEvent {
  event_type: "${eventTypeKey}"`
    const { nEvents, keyOccurence } = eventTypeOccurenceMap;
    for(const [propKey, nOccurence] of Object.entries(keyOccurence)) {
      if(baseKeys.includes(propKey)) continue;
      fileContent += `
  ${propKey}${nOccurence === nEvents ? "" : "?"}: ${manualKeyTypeMap[propKey] || 'string'}`
    } 
    fileContent += `
}`
  }

  fileContent += `
  
export type BirdieEvent = ${Object.keys(typeKeyOccurenceFrequencyMap).map(eventTypeKey => {
    return pascalCase(eventTypeKey+"Event")
  }).join(` | `)}`

  await fs.writeFile('./EventType.ts', fileContent, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  db.destroy()
})()

function pascalCase (str: string) { return upperFirst(camelCase(str)) }

function generateOccurenceMaps(eventPayloads: Array<Record<string, any>>) {
  const globalKeyOccurenceMap: Record<string, number> = {}
  const typeKeyOccurenceFrequencyMap = eventPayloads.reduce((typeKeyOccurenceFrequencyMap, payload) => {
    const eventType = payload.event_type;
    if(!typeKeyOccurenceFrequencyMap[eventType]) typeKeyOccurenceFrequencyMap[eventType] = {
      nEvents: 0,
      keyOccurence: {}
    }
    const freqMap = typeKeyOccurenceFrequencyMap[eventType]
    freqMap.nEvents += 1;
    const occurenceMap = freqMap.keyOccurence;
    Object.keys(payload).forEach(key => {
      occurenceMap[key] = occurenceMap[key] ? occurenceMap[key] + 1 : occurenceMap[key] = 1;
      globalKeyOccurenceMap[key] = globalKeyOccurenceMap[key] ? globalKeyOccurenceMap[key] + 1 : globalKeyOccurenceMap[key] = 1;
    })
    return typeKeyOccurenceFrequencyMap
  }, {})
  return { globalKeyOccurenceMap, typeKeyOccurenceFrequencyMap }
}

function getBaseKeys(globalKeyOccurenceMap: Record<string, number>, nRecords: number) {
  const baseKeys = [];
  for (const [key, nOccurence] of Object.entries(globalKeyOccurenceMap)) {
    if(nOccurence === nRecords) baseKeys.push(key)
  }
  return baseKeys;
}
/*
type EventTypeOccurenceData = {
  nEvents: number,
  keyOccurence: Record<string, number>
}*/