import { Helia, createHelia } from 'helia';
import { json, JSON as HeliaJSON } from '@helia/json';
import { Libp2p } from 'libp2p';

let helia: Helia<Libp2p> | null = null;
let j: HeliaJSON | null = null;

async function getHeliaInstance() {
    if (!helia) {
        helia = await createHelia();
    }
    return helia;
}

export async function getHeliaJSON() {
    if (!j) {
        const heliaInstance = await getHeliaInstance();
        j = json(heliaInstance);
    }
    return j;
}
