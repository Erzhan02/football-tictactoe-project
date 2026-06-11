import { prisma } from '../lib/prisma.js';

async function searchWikidataId(name: string): Promise<string | null> {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(
    name
  )}&language=en&format=json&limit=5&type=item&origin=*`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
    }
  });
  const data = (await response.json()) as any;
  if (data.search && data.search.length > 0) {
    return data.search[0].id;
  }
  return null;
}

async function debugJames() {
  const qid = await searchWikidataId("James Rodriguez");
  console.log(`Found QID: ${qid}`);
  if (!qid) return;

  const url = `https://www.wikidata.org/wiki/Special:EntityData/${qid}.json`;
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
    }
  });
  const data = (await response.json()) as any;
  const entity = data.entities[qid];
  console.log("Claims keys:", Object.keys(entity.claims || {}));
  
  const clubClaims = entity.claims?.P54 || [];
  console.log(`Found ${clubClaims.length} club claims for James:`);
  for (const cClaim of clubClaims) {
    const clubQid = cClaim.mainsnak?.datavalue?.value?.id;
    if (!clubQid) continue;
    
    // Fetch label
    const labelUrl = `https://www.wikidata.org/wiki/Special:EntityData/${clubQid}.json`;
    const labelRes = await fetch(labelUrl, {
      headers: {
        'User-Agent': 'FootballTicTacToeBot/1.0 (contact: admin@football-tictactoe.com)'
      }
    });
    const labelData = (await labelRes.json()) as any;
    const label = labelData.entities[clubQid]?.labels?.en?.value || 'No English Label';
    console.log(`- QID: ${clubQid}, Label: ${label}`);
  }
}

debugJames()
  .catch(console.error);
