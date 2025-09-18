import { createMembershipApplication } from '../src/services/membership'
import { MembershipApplication } from '../src/lib/types'
import { Timestamp } from 'firebase/firestore'


const testApplication : MembershipApplication = getTestApplication();
const res = await createMembershipApplication(testApplication);
console.log(res);


/*
RANDOM TEST APPLICATION
*/


function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getTestApplication(): MembershipApplication {
  const salutations = ["Herr", "Frau", "Divers"];
  const firstNames = ["Magdalena", "Thomas", "Lena", "Max", "Sophie", "Jonas"];
  const lastNames = ["Nienaber", "Müller", "Schmidt", "Becker", "Tiedtke"];
  const streets = ["Brauweg", "Hauptstraße", "Bahnhofstraße", "Ringweg", "Marktplatz"];
  const cities = ["Göttingen", "Hannover", "Berlin", "Hamburg", "Köln"];
  const occupations = ["Student", "Studentin", "Ingenieur", "Lehrerin", "Arzt"];
  const bics = ["COBADEFFXXX", "DEUTDEFFXXX", "GENODEF1GÖT", "NOLADE21GOE"];

  const firstName = getRandom(firstNames);
  const lastName = getRandom(lastNames);
  const city = getRandom(cities);
  const street = getRandom(streets);
  const houseNumber = Math.floor(Math.random() * 100) + 1;

  // Geburtstage zufällig zwischen 1985 und 2005
  const birthYear = 1985 + Math.floor(Math.random() * 20);
  const birthDate = `${birthYear}-01-01`;

  const schoolFrom = `${birthYear + 6}-09-01`;
  const schoolTo = `${birthYear + 12}-06-30`;

  // Dummy-IBAN (keine echte Prüfziffer)
  const iban = "DE89" + Math.floor(Math.random() * 1e16).toString().padStart(16, "0");

  return {
    salutation: getRandom(salutations),
    firstName,
    lastName,
    address: `${street} ${houseNumber}`,
    postalCode: "37000",
    city,
    birthDate,
    occupation: getRandom(occupations),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
    schoolFrom,
    schoolTo,
    iban,
    bic: getRandom(bics),
    placeDate: `${city}, 01.01.2024`,
    signature: `${firstName} ${lastName}`,
    createdAt: Timestamp.now(),
    status: "new"
  };
}