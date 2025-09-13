import { createMembershipApplication } from '../src/services/membership'
import { MembershipApplication } from '../src/lib/types'
import { Timestamp } from 'firebase/firestore'

const testApplication : MembershipApplication = {
    salutation: "Frau",
    firstName: "Magdalena",
    lastName: "Nienaber",
    address: "Brauweg 23",
    postalCode: "37079",
    city: "Göttingen",
    birthDate: "1990-01-01",
    occupation: "Studentin",
    email: "magdalena.nienaber@gmail.com",
    schoolFrom: "2010-01-01",
    schoolTo: "2014-01-01",
    iban: "DE89 3704 0044 0532 0130 00",
    bic: "COBADEFFXXX",
    placeDate: "Göttingen, 01.01.2024",
    signature: "Magdalena Nienaber",
    createdAt: Timestamp.now(),
    status: "pending"
  }


const res = await createMembershipApplication(testApplication);
console.log(res);