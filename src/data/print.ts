import { locations } from './locations'
import { tokens } from './tokens'


console.log('MSP TOKENS')
for (const token of tokens) {
    console.log(token.uid)
}

console.log('\nCPO LOCATIONS')
for (const location of locations) {
    for (const evse of location?.evses ?? []) {
        console.log(evse.uid)
    }
}
