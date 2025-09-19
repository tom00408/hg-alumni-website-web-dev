import { randomUUID } from 'crypto';
import { submitMembershipApplication } from '../src/services/users'
import { MembershipApplication } from '../src/lib/types'


async function testMembershipApplication() {

    for(let i = 0; i < 10; i++) {
    const uid = randomUUID();
    const applicationData = getRandomMembershipApplication();

    const user = await submitMembershipApplication(uid, applicationData);
    console.log(user);
    }
}


function getRandomMembershipApplication(): Omit<MembershipApplication, 'id' | 'createdAt' | 'applicationStatus' | 'userId'> {
    // Data pools
    const salutations = ['Herr', 'Frau', 'Divers'];
    const firstNames = ['Max', 'Anna', 'Thomas', 'Sarah', 'Michael', 'Lisa', 'David', 'Julia', 'Stefan', 'Maria', 'Christian', 'Laura', 'Daniel', 'Nina', 'Alexander', 'Sophie', 'Markus', 'Emma', 'Sebastian', 'Lena'];
    const lastNames = ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann'];
    const streets = ['Hauptstraße', 'Bahnhofstraße', 'Kirchgasse', 'Schulstraße', 'Gartenstraße', 'Dorfstraße', 'Mühlenweg', 'Lindenstraße', 'Bergstraße', 'Waldweg'];
    const cities = ['München', 'Berlin', 'Hamburg', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig', 'Bremen', 'Dresden', 'Hannover', 'Nürnberg', 'Duisburg'];
    const occupations = ['Ingenieur', 'Lehrer', 'Arzt', 'Anwalt', 'Architekt', 'Programmierer', 'Berater', 'Manager', 'Wissenschaftler', 'Designer', 'Journalist', 'Verkäufer', 'Handwerker', 'Pfleger', 'Student'];
    
    const salutation = getRandomItem(salutations);
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const street = getRandomItem(streets);
    const city = getRandomItem(cities);
    const occupation = getRandomItem(occupations);
    
    const houseNumber = Math.floor(Math.random() * 200) + 1;
    const postalCode = (Math.floor(Math.random() * 90000) + 10000).toString();
    const birthYear = Math.floor(Math.random() * 40) + 1960; // Geburtsjahr zwischen 1960-2000
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const schoolFromYear = birthYear + 6 + Math.floor(Math.random() * 2); // Schulbeginn zwischen 6-7 Jahren
    const schoolToYear = schoolFromYear + 12 + Math.floor(Math.random() * 3); // Schuldauer 12-14 Jahre
    
    const bankCode = String(Math.floor(Math.random() * 99999999)).padStart(8, '0');
    const accountNumber = String(Math.floor(Math.random() * 9999999999)).padStart(10, '0');
    const iban = `DE${Math.floor(Math.random() * 90) + 10}${bankCode}${accountNumber}`;
    
    const bicCodes = ['DEUTDEFF', 'COBADEFF', 'DRESDEFF', 'BYLADEM1', 'GENODEF1', 'SOGEDEFF', 'INGDDEFF', 'NOLADE21'];
    const bic = getRandomItem(bicCodes);
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(['gmail.com', 'web.de', 'gmx.de', 't-online.de', 'yahoo.de'])}`;
    
    return {
        salutation,
        firstName,
        lastName,
        email,
        address: `${street} ${houseNumber}`,
        postalCode,
        city,
        birthDate: `${birthDay}.${birthMonth}.${birthYear}`,
        occupation,
        schoolFrom: schoolFromYear.toString(),
        schoolTo: schoolToYear.toString(),
        iban,
        bic,
        placeDate: `${city}, ${new Date().toLocaleDateString('de-DE')}`,
        signature: `${firstName} ${lastName}`,
    };
}

function getRandomItem<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
}


testMembershipApplication();